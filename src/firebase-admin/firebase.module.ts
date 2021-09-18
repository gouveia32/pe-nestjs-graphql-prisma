import { Module, DynamicModule, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as _admin from 'firebase-admin';

@Global()
@Module({

  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  static forRoot(options: {
    options: _admin.AppOptions;
    name?: string;
  }): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [
      
        {
          provide: 'FIREBASE_CONFIG_OPTIONS',
          useValue: options,
        },
        FirebaseService,
      ],
      exports: [FirebaseService],
    };
  }
}
