// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyB_SdKRI5rFBMb2z4oaX4i5-zKRuXJGJcI",
    authDomain:"smartsyllo.firebaseapp.com" ,
    projectId: "smartsyllo",
    storageBucket:"smartsyllo.firebasestorage.app" ,
    messagingSenderId:"1032870377118" ,
    appId:"1:1032870377118:web:18e2b5a337dc8bd8172d8f", 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();