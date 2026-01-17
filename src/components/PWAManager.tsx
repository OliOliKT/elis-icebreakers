'use client';

import { useEffect, useState } from 'react';

export default function PWAManager() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure we're only running on the client after hydration
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run PWA logic after component is mounted (post-hydration)
    if (!isMounted) return;
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle app install prompt
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show custom install button/banner
      showInstallPromotion();
    });

    function showInstallPromotion() {
      // Create install button if it doesn't exist
      if (!document.getElementById('pwa-install-btn')) {
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = 'Install app';
        installBtn.className = 'fixed bottom-4 right-4 text-white text-sm font-bold bg-black/50 backdrop-blur-sm px-4 py-3 rounded-full hover:bg-black/60 transition cursor-pointer shadow-lg border border-white/40';        installBtn.style.cursor = 'pointer';        
        installBtn.addEventListener('click', () => {
          // Hide the install promotion
          installBtn.style.display = 'none';
          
          // Show the install prompt
          if (deferredPrompt) {
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
              } else {
                console.log('User dismissed the install prompt');
              }
              deferredPrompt = null;
            });
          }
        });
        
        document.body.appendChild(installBtn);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          if (installBtn && installBtn.parentNode) {
            installBtn.remove();
          }
        }, 10000);
      }
    }

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      // Hide install button if it exists
      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) {
        installBtn.remove();
      }
    });

  }, [isMounted]);

  return null; // This component doesn't render anything visible
}