import { Injectable } from '@angular/core';

import firebase from 'firebase/app';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public firebase;

  constructor() {
    this.firebase = firebase.initializeApp(environment.firebaseConfig);
  }
}
