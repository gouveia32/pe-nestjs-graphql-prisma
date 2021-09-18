import { Injectable, Inject, HttpService, Optional, Scope } from '@nestjs/common';
import * as _admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class FirebaseService {
  private _app: _admin.app.App;

  private _signInWithProviderHost = 'https://identitytoolkit.googleapis.com';
  // private signInWithEmailHost = 'https://identitytoolkit.googleapis.com';

  private _signInWithProviderPath;
  private _signInWithEmailPath;
  private FIREBASE_API_KEY;
  constructor(
   @Optional() @Inject('FIREBASE_CONFIG_OPTIONS')
    private appOptions: { options: _admin.AppOptions; name?: string },
    private readonly config: ConfigService,
  ) {
    this.FIREBASE_API_KEY = this.config.get<String>('FIREBASE_API_KEY');
    this._signInWithProviderPath = `/v1/accounts:signInWithIdp?key=${this.FIREBASE_API_KEY}`;
    this._signInWithEmailPath = `/v1/accounts:signInWithPassword?key=${this.FIREBASE_API_KEY}`;

    if (this.appOptions) {
      this._app = _admin.initializeApp(
        this.appOptions.options,
        this.appOptions.name,
      );
    } else {
      const FIREBASE_PROJECT_ID = this.config.get<string>(
        'FIREBASE_PROJECT_ID',
      );
      const STORAGE_BUCKET = this.config.get<string>('STORAGE_BUCKET');
      const GOOGLE_APPLICATION_CREDENTIALS = this.config.get<string>(
        'GOOGLE_APPLICATION_CREDENTIALS',
      );
      this._app = _admin.initializeApp({
        credential: _admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
        databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
        storageBucket: STORAGE_BUCKET,
      });
    }
  }

  get admin() {
    return _admin;
  }
  get app() {
    return this._app;
  }
  get signInWithProviderHost() {
    return this._signInWithProviderHost;
  }

  get signInWithProviderPath() {
    return this._signInWithProviderPath;
  }

  get signInWithEmailPath() {
    return this._signInWithEmailPath;
  }

  uploadFile(
    userId,
    filename,
    mimetype,
    stream,
    action,
    expires = '03-09-2087',
  ): Promise<String> {
    const storage = this.admin.storage();
    const file = storage.bucket().file(filename);
    const options = {
      gzip: true,
      resumable: false,
      metadata: {
        contentType: mimetype,
        metadata: {
          author: userId,
        },
      },
    };
    return new Promise((resolve: (value: string) => any, reject) => {
      stream
        .pipe(file.createWriteStream(options))
        .on('error', (err) => {
          reject(err);
        })
        .on('finish', () => {
          // The file upload is complete.
          file
            .getSignedUrl({
              action: action || 'read',
              expires: expires,
            })
            .then(([url]) => {
              resolve(url);
            })
            .catch((e) => reject(e));
        });
    }).then((url) => url);
  }
}
