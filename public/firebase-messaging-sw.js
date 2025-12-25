// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDIP3IilCWbPvDJf-eLqBSlTYqK5LZsgxA",
  authDomain: "gazzow-notifications-2a4ec.firebaseapp.com",
  projectId: "gazzow-notifications-2a4ec",
  storageBucket: "gazzow-notifications-2a4ec.firebasestorage.app",
  messagingSenderId: "518516613804",
  appId: "1:518516613804:web:7b4ba2e3c7ec653107b509",
  measurementId: "G-VKFDVTPR3G"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  // 👇 Handle both notification and data-only messages
  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "New Notification";

  const options = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "You have a new message",
    // icon: "/firebase-logo.png",
    data: payload.data
  };

  self.registration.showNotification(title, options);
});
