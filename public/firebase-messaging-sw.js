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

// This callback is executed when a background message is received.
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  
  // Customize the notification displayed to the user.
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message.',
    icon: payload.notification?.icon || '/firebase-logo.png', // Fallback icon path
    data: payload.data // Pass along any custom data for later retrieval if needed
  };

  // Show the notification using the Service Worker's registration.
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Remove the 'activate' listener's getToken call.
// The service worker does not need to obtain or manage its own token.
// Its role is purely to handle incoming messages when the app is in the background.
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Service Worker activated.');
    // Any other non-FCM token related activation logic can go here if needed.
});
