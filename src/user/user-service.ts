import { Injectable, HttpService } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { isEmail, isAlphanumeric, isLength } from 'validator';
import { AuthInput, AuthResult, Role, User } from 'src/models/graphql';
import { FirebaseService } from 'src/firebase-admin/firebase.service';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseApp: FirebaseService,
    private readonly prisma: PrismaClient,
    private readonly httpService: HttpService
  ) {
    this.httpService.axiosRef.defaults.baseURL = this.firebaseApp.signInWithProviderHost;
    this.httpService.axiosRef.defaults.headers.post['Content-Type'] = 'application/json';
  }
  async signup(credentials: AuthInput): Promise<AuthResult> {
    return this.signupWithEmail(credentials)
  }
  async signupWithEmail(data: AuthInput): Promise<AuthResult> {
    const { email, password, displayName } = data;
    if (!isEmail(email)) {
      throw new Error('Invalid Email');
    } else if (!isLength(password, 6)) {
      throw new Error('Password must be atleast 6 characters long');
    } else if (!isLength(displayName, 3)) {
      throw new Error('Username must be 3 characters or more');
    }/* else if (!isAlphanumeric(displayName)) {
      throw new Error('Username can not contain special characters');
    }*/ else {
      const users = this.prisma.user;
      const exist = await users
        .findOne({ where: { email } })
        .catch(() => false);
      if (exist) {
        throw new Error(
          'The email address is already in use by another account',
        );
      } else {
        return this._createUserWithEmail(email, password, displayName)
          .then((user) =>
            users.create({
              data: {
                uid: user.uid,
                displayName: user.displayName,
                disabled: user.disabled,
                email: user.email,
                emailVerified: user.emailVerified,
                avator: {
                  create: {
                    path: user.photoURL || "",
                    filename: user.photoURL || "",
                    mimetype: 'image/*',
                    encoding: 'UTF-8',
                  },
                },
                role: Role.USER,
              },
            }).catch(async (e) => {
              await users.delete({ where: { email } });
              throw e;
            })
          )
          .then(async (user) => {
            const setClaims = await this._setUserClaims(user);
            if (setClaims) {
              debugger
              const session = await this.signInWithEmail({ email, password })
               // .then(({ idToken }) => this.createSessionToken(idToken))
                .catch((e) => e);
                
              if (session instanceof Error) {
                await this.cleanUpOnSignUpFailure(user);
                throw session;
              }
              return session;
            }

            if (!await this.cleanUpOnSignUpFailure(user)) {
              throw Error('Failed to cleanup user signup errors')
            };
            throw Error('Failed to create user account')
          })
          .then((session) => session);
      }
    }
  }

  private async cleanUpOnSignUpFailure(user) {
   
    const remove1 = await this.firebaseApp.admin
      .auth()
      .deleteUser(user.uid)
      .then(() => true)
      .catch(() => false);
    const remove2 = await this.prisma.user
      .delete({ where: { uid: user.uid } })
      .then(() => true)
      .catch(() => false);
    return remove1 && remove2;
  }

  signInWithEmail({ email, password }) {
    const returnSecureToken = true;
    const buffer = Buffer.from(
      JSON.stringify({ email, password, returnSecureToken }),
    );
    return this.httpService.axiosRef
      .post(this.firebaseApp.signInWithEmailPath, buffer)
      .then(async ({ status, data }) => {
        if (status === 200) {
          const { idToken } = data;
          const session = await this.createSessionToken(idToken).catch(
            (e) => e,
          );
          if (session instanceof Error) {
            const { message } = session;
            throw new Error(message || 'Signin failed something went wrong');
          }
          return session;
        }
        throw Error(data);
      });
  }

  _createUserWithEmail(email, password, displayName) {
    return this.firebaseApp.admin.auth().createUser({
      email,
      emailVerified: false,
      // phoneNumber: '+11234567890',
      password,
      displayName,
      // photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: false,
    });
  }

  _setUserClaims(user) {
    return this.firebaseApp.admin
      .auth()
      .setCustomUserClaims(user.uid, { role: Role.USER })
      .then(() => true)
      .catch(() => false);
  }

  createSessionToken(idToken, expiresIn = 60 * 60 * 5 * 24 * 1000) {
    
    return this.firebaseApp.admin
      .auth()
      .verifyIdToken(idToken, true)
      .then((decodedIdToken) => {
        // Only process if the user just signed in in the last 5 minutes.
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
          // Create session cookie and return it.
          return this.firebaseApp.admin
            .auth()
            .createSessionCookie(idToken, { expiresIn })
            .then((token) => {
              return this.prisma.user
                .findOne({ where: { uid: decodedIdToken.uid } })
                .then((user) => {
                  return {
                    user,
                    token,
                    message: 'Session created successfully',
                  };
                });
            });
        }
        throw Error(
          'A user that was not recently signed in is trying to set a session',
        );
      });
  }

  destroySessionToken(sessionToken) {
    return this.firebaseApp.admin
      .auth()
      .verifySessionCookie(sessionToken)
      .then((decodedClaims) =>
        this.firebaseApp.admin.auth().revokeRefreshTokens(decodedClaims.sub),
      )
      .then(() => ({
        status: true,
        message: 'Session destroyed successfully',
      }));
  }

  /*
  linkIdProvider({ idToken, username }) {
    log(idToken);
    log(username);
    if (!idToken) {
      throw new Error('No id token provided');
    } else if (!username) {
      throw new Error('No username provided');
    } else {
      return admin.auth().verifyIdToken(idToken, true)
        .then(async (info) => {
          const {
            role, uid,
          } = info;

          if (role) {
            throw new Error('Provided token is already linked to a user');
          } else if (!isLength(username, 3)) {
            throw new Error('Username must be 3 characters or more');
          } else if (!isAlphanumeric(username)) {
            throw new Error('Username can not contain special characters');
          } else {
            const user = await admin.auth().getUser(uid).catch((error) => error);
            if (user instanceof Error) {
              throw new Error('Failed to get user account');
            } else {
              const {
                email, displayName, photoURL, phoneNumber, disabled, emailVerified,
              } = user;

              const users = DB.collection('Users');
              const exist = await users.firstExample({ email }).catch(() => false);
              const exist2 = await users.firstExample({ username }).catch(() => false);
              if (exist) {
              // Todo handle case were user is in database and firebase but has no claims set
                throw new Error('The email address is already in use by another account');
              } else if (exist2) {
                throw new Error('The Username is already in use by another account');
              } else {
              // link user here
                const auser = await users.save({
                  _key: uid,
                  username,
                  displayName,
                  phoneNumber,
                  disabled,
                  email,
                  emailVerified,
                  avator: photoURL,
                  role: 'SUBSCRIBER',
                }).catch((error) => error);

                if (auser instanceof Error) {
                  throw new Error(auser.message || 'Failed to create user account');
                } else {
                // set claims here
                  const setClaims = await this._setUserClaims(auser);
                  if (setClaims) {
                    const data = await users.document(auser).catch((error) => error);
                    if (data instanceof Error) {
                      throw new Error('Failed to get user info with session');
                    } else {
                      return { user: data, message: 'Account linked successfully' };
                    }
                  }
                }
              }
            }
          }
          return null;
        });
    }
  }

  async updateProfile(user, profile, avatorFile, coverFile) {
    this.isLogedIn(user._id);
    const userData = {};


    if (avatorFile) {
      const {
        createReadStream, filename, mimetype,
      } = await avatorFile;
      const stream = createReadStream();
      const fileUrl = await uploadFile(user._id, `profile/${user._id}/avator/${filename}`, mimetype, stream)
        .catch((e) => {
          const { message } = e;
          throw new Error(message || 'Failed to upload file');
        });
      if (!fileUrl) throw new Error('Failed to upload file');
      log(fileUrl);
      userData.photoURL = fileUrl;
    }
    // todo handle cover file
    if (coverFile) {
      const {
        createReadStream, filename, mimetype,
      } = await coverFile;
      const stream2 = createReadStream();
      const fileUrl2 = await uploadFile(user._id, `profile/${user._id}/cover/${filename}`, mimetype, stream2)
        .catch((e) => {
          const { message } = e;
          throw new Error(message || 'Failed to upload file');
        });
      if (!fileUrl2) throw new Error('Failed to upload file');
      userData.cover = fileUrl2;
    }
    let newUsername;
    if (profile) {
      const {
        username, avator, displayName, email, phoneNumber, cover, bio,
      } = profile;
      if (username) {
        const exist = await this.usersCol.firstExample({ username }).catch((e) => e);
        if (!(exist instanceof Error)) {
          if (exist._key !== user._key) {
            throw new Error('Username already in use with another account');
          }
        }
        newUsername = username;
        if (!isAlphanumeric(newUsername) || !isLength(newUsername, 3)) {
          throw new Error('Username must be 3 characters or more and not contain special characters');
        }
      }
      // const oldInfo = await this.usersCol.document(_id).catch((e) => e);
      // if (oldInfo instanceof Error) throw oldInfo;
      // eslint-disable-next-line prefer-const

      if (bio) userData.bio = bio;
      if (avator) userData.photoURL = avator;
      if (displayName && isLength(displayName, 2)) userData.displayName = displayName;
      if (email) userData.email = email;
      if (phoneNumber) userData.phoneNumber = phoneNumber;
      userData.cover = cover || userData.cover || user.cover;
    }
    const fuser = await admin.auth().updateUser(user._key, userData).catch((e) => e);
    if (fuser instanceof Error) {
      const { message } = fuser;
      throw new Error(message || 'Failed to update firebase user');
    }
    newUsername = newUsername || user.username;
    const data = {
      username: newUsername,
      email: fuser.email,
      phoneNumber: fuser.phoneNumber,
      avator: fuser.photoURL,
      displayName: fuser.displayName,
      disabled: fuser.disabled,
      emailVerified: fuser.emailVerified,
      cover: userData.cover,
    };
    if (userData.bio) data.bio = userData.bio;
    const auser = await this.usersCol.update(user._id, data)
      .then(() => this.usersCol.document(user._id)).catch((e) => e);
    if (auser instanceof Error) {
      throw auser;
    }
    return { user: auser, message: 'Profile updated successfully' };
  }
*/
}
