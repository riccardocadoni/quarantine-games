import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyB0aTXkeT9rnqFh1OT1VDZwGCbPmMnev84',
  authDomain: 'quarantinegame.firebaseapp.com',
  databaseURL: 'https://quarantinegame.firebaseio.com',
  projectId: 'quarantinegame',
  storageBucket: 'quarantinegame.appspot.com',
  messagingSenderId: '820840056441',
  appId: '1:820840056441:web:7a79d37bddf3a19c5ab6a8',
  measurementId: 'G-HK809GBWGN'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
