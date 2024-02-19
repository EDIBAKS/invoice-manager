import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCC4Xevx5ky5yiVm4Ydc104gr9ihQS4LuQ",
  authDomain: "invoice-app-y.firebaseapp.com",
  projectId: "invoice-app-y",
  storageBucket: "invoice-app-y.appspot.com",
  messagingSenderId: "1023739533627",
  appId: "1:1023739533627:web:80fa09c4880e32e457ff1e"
};


const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}