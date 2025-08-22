// public/firebase-messaging-sw.js

// Import the Firebase app and messaging SDKs using 'importScripts' for a service worker.
// These are the 'compat' versions, suitable for use with importScripts.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase project configuration object.
// This must be identical to the one used in your main application's Firebase initialization.
const firebaseConfig = {
  apiKey: "AIzaSyAD_HJcKzLkrYtiBfUFt3a4xICRS3n1Wm0",
  authDomain: "landscape-friend.firebaseapp.com",
  projectId: "landscape-friend",
  storageBucket: "landscape-friend.firebasestorage.app",
  messagingSenderId: "373141664807",
  appId: "1:373141664807:web:31bd61502ffd0447c98a02",
  measurementId: "G-81G4YHH25C"
};

// Initialize the Firebase app in the service worker.
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// This callback is executed when a background message is received.
// A background message is one where the web app is not in the foreground (closed, or in another tab).
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  
  // Customize the notification displayed to the user.
  // You can extract title, body, icon etc., from the payload.
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message.',
    icon: payload.notification.icon || '/firebase-logo.png', // Fallback icon path
    data: payload.data // Pass along any custom data for later retrieval if needed
  };

  // Show the notification using the Service Worker's registration.
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// The 'activate' event for the service worker.
// While your FCMProvider now handles the primary token acquisition and permission request,
// the service worker can still attempt to get/refresh its token when it activates,
// but only if permission has *already* been granted by the main app.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Replace with your actual VAPID key. This must match the one used in your main app.
        const VAPID_KEY = "BPFSqTStA7Mj1cwUo71zL-1oCgTz6ap4DGGRzEzFpHzA_MYIke8WhKiiHnwg0YBut0Yg3ruXouTNfOvWL3apin4"; 
        
        // IMPORTANT: This getToken() call will only succeed if notification permission
        // has already been explicitly granted by the user through your main web application.
        // If permission has NOT been granted, it will result in the
        // "messaging/permission-blocked" error, as a service worker cannot prompt for permission.
        const currentToken = await messaging.getToken({ vapidKey: VAPID_KEY });
        
        if (currentToken) {
          console.log('[firebase-messaging-sw.js] FCM Token obtained on activate:', currentToken);
          // If you want the service worker to also independently send the token to your API,
          // uncomment and adapt the fetch request below. Otherwise, your main app (FCMProvider)
          // is already handling this.
          /*
          const response = await fetch('/api/register-device', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: currentToken }),
          });

          if (response.ok) {
            console.log('[firebase-messaging-sw.js] Token successfully sent to API on activate.');
          } else {
            console.error('[firebase-messaging-sw.js] Failed to send token to API on activate. Status:', response.status, 'Status Text:', response.statusText);
          }
          */
        } else {
          console.log('[firebase-messaging-sw.js] No registration token available on activate. Permission might not be granted yet, or user blocked.');
        }
      } catch (err) {
        console.error('[firebase-messaging-sw.js] Error getting or sending token on activate:', err);
        if (err.code === 'messaging/permission-blocked') {
          console.warn('[firebase-messaging-sw.js] Notification permission was blocked. This must be handled by your main application via a user gesture.');
        }
      }
    })()
  );
});
