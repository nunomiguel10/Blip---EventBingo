// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

//TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCdUPHotgBOyfdm3oNdHTnvzUzh90TS7QQ',
    authDomain: 'blip-eventbingo.firebaseapp.com',
    databaseURL: 'https://blip-eventbingo-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: 'blip-eventbingo',
    storageBucket: 'blip-eventbingo.appspot.com',
    messagingSenderId: '32407126196',
    appId: '1:32407126196:web:fc3a6012f5f021e96557e1'
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
