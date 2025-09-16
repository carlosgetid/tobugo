import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered successfully: ', registration);
        console.log('SW scope: ', registration.scope);
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
        console.error('Error name:', registrationError.name);
        console.error('Error message:', registrationError.message);
        console.error('Error stack:', registrationError.stack);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
