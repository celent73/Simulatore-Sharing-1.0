
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Fixed to default import

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker NUCLEAR RESET
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        console.log('Found ' + registrations.length + ' service workers. Unregistering all to force update...');
        let unregisterPromises = registrations.map(r => r.unregister());
        Promise.all(unregisterPromises).then(() => {
          console.log('All SWs unregistered. Reloading...');
          window.location.reload();
        });
      } else {
        console.log('No service workers found. Clean state.');
      }
    });
  });
}
