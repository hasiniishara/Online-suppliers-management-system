import  firebase from 'firebase';
import  'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBvBhJn4PXE8XGDUKB8TVNkNTxAGiBUHe8",
  authDomain: "manage-cf11d.firebaseapp.com",
  databaseURL: "https://manage-cf11d.firebaseio.com",
  projectId: "manage-cf11d",
  storageBucket: "manage-cf11d.appspot.com",
  messagingSenderId: "84714244884",
  appId: "1:84714244884:web:8eb5a3d91336625916d001",
  measurementId: "G-JXBS69H6FZ"
};

  firebase.initializeApp(firebaseConfig);
  firebase.firestore();

  export default firebase;

 