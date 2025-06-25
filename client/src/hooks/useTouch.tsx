import { useEffect, useRef } from 'react';

interface UseTouchReturn {
  isTouchDevice: boolean;
}

export function useTouch(): UseTouchReturn {
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Check if the device supports touch
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Add touch-friendly classes
    if (isTouchDevice.current) {
      document.documentElement.classList.add('touch-device');
    }

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (event: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    if (isTouchDevice.current) {
      document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    }

    return () => {
      if (isTouchDevice.current) {
        document.removeEventListener('touchend', preventDoubleTapZoom);
      }
    };
  }, []);

  return {
    isTouchDevice: isTouchDevice.current,
  };
}