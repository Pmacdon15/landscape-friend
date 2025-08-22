// public/firebase-messaging-sw.js

// Import the Firebase app and messaging SDKs.
// Using 'compat' versions is fine for service workers with importScripts.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase project configuration object.
const firebaseConfig = {
  apiKey: "AIzaSyAD_HJcKzLkrYtiBfUFt3a4xICRS3n1Wm0",
  authDomain: "landscape-friend.firebaseapp.com",
  projectId: "landscape-friend",
  storageBucket: "landscape-friend.firebasestorage.app",
  messagingSenderId: "373141664807",
  appId: "1:373141664807:web:31bd61502ffd0447c98a02",
  // measurementId is not needed in the service worker
};

// Initialize the Firebase app in the service worker.
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// The onBackgroundMessage callback is removed to allow Novu to handle all notifications.
// No explicit background message handling in the service worker.