import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig={
apiKey:"AIzaSyCjyWhKlOiXpjs-FH0S1BAdYBswyDF_qz8",
authDomain:"bet-capgemini.appspot.com",
projectId:"bet-capgemini",
storageBucket:"bet-capgemini.appspot.com",
messagingSenderId:"12657127604",
appId:"1:12657127604:android:3a7a850927d9cae048a7e1"
}
const app= initializeApp(firebaseConfig);
export const firestore=getFirestore(app);