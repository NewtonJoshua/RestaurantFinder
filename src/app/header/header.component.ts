import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: Observable<firebase.User>;

  ngOnInit() {
  }

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).
      then(res => console.log(res));
  }

  logout() {
    const providers = [firebase.auth.EmailAuthProvider, firebase.auth.FacebookAuthProvider, firebase.auth.GithubAuthProvider,
    firebase.auth.GoogleAuthProvider, firebase.auth.TwitterAuthProvider];
    this.afAuth.auth.signOut();
  }

}
