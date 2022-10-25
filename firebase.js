import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAx4bG4zx3MOnoG28LQ_5P6icVqh192yD8",
  authDomain: "chatorientation.firebaseapp.com",
  projectId: "chatorientation",
  storageBucket: "chatorientation.appspot.com",
  messagingSenderId: "516745509802",
  appId: "1:516745509802:web:135ee637a8ad37ccd509d3",
  measurementId: "G-MYYWBDCGYP"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { auth, db };
