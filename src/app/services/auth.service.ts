import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private idToken: string;
  public user;

  constructor(private firebaseService: FirebaseService) {
    this.idToken = null;

    this.firebaseService.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      }
    });

    this.login();
  }

  async getIdToken(refresh: boolean = false) {
    if (this.idToken == null || refresh) {
      try {
        this.idToken = await this.generateTokenId();
      } catch (error) {
        console.error('getIdToken ERROR', error);
      }
    }

    return this.idToken;
  }

  private generateTokenId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseService.firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user
            .getIdToken(true)
            .then((idToken) => {
              resolve(idToken);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }

  private login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseService.firebase
        .auth()
        .signInAnonymously()
        .then((userCredential) => {
          if (userCredential) {
            resolve(userCredential);
          } else {
            reject('There are not user credentials');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private logout() {
    this.firebaseService.firebase.auth().signOut();
  }
}
