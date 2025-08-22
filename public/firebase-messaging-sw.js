importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object. For more information, see
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAD_HJcKzLkrYtiBfUFt3a4xICRS3n1Wm0",
  authDomain: "landscape-friend.firebaseapp.com",
  projectId: "landscape-friend",
  storageBucket: "landscape-friend.firebasestorage.app",
  messagingSenderId: "373141664807",
  appId: "1:373141664807:web:31bd61502ffd0447c98a02",
  measurementId: "G-81G4YHH25C"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// If you would like to customize the notification that is displayed when a
// background message is received, specify the following callback:
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- New logic for direct token registration ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Replace with your actual VAPID key
        const VAPID_KEY = "YOUR_FIREBASE_VAPID_KEY_HERE"; 
        const currentToken = await messaging.getToken({ vapidKey: VAPID_KEY });
        if (currentToken) {
          console.log('[firebase-messaging-sw.js] FCM Token obtained on activate:', currentToken);
          // Send token to your API route
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
            const errorData = await response.json();
            console.error('[firebase-messaging-sw.js] Failed to send token to API on activate:', errorData);
          }
        } else {
          console.log('[firebase-messaging-sw.js] No registration token available on activate.');
        }
      } catch (err) {
        console.error('[firebase-messaging-sw.js] Error getting or sending token on activate:', err);
      }
    })()
  );
});
