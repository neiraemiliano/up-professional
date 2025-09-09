// Touch Gestures Utility for Mobile-First Experience
export class TouchGestureHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      swipeThreshold: 50,
      pinchThreshold: 0.2,
      tapDelay: 300,
      longPressDelay: 500,
      ...options
    };
    
    this.touchStart = { x: 0, y: 0, time: 0 };
    this.touchEnd = { x: 0, y: 0, time: 0 };
    this.initialDistance = 0;
    this.currentScale = 1;
    this.tapTimeout = null;
    this.longPressTimeout = null;
    this.isLongPress = false;
    
    this.init();
  }

  init() {
    // Prevent default touch behaviors
    this.element.style.touchAction = 'manipulation';
    
    // Add event listeners
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Handle multi-touch for pinch gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.initialDistance = this.getDistance(touch1, touch2);
    }

    // Start long press timer
    this.longPressTimeout = setTimeout(() => {
      this.isLongPress = true;
      this.triggerEvent('longpress', { x: touch.clientX, y: touch.clientY });
    }, this.options.longPressDelay);

    this.triggerEvent('touchstart', { x: touch.clientX, y: touch.clientY });
  }

  handleTouchMove(e) {
    // Clear long press if user moves finger
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    // Handle pinch gesture
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = this.getDistance(touch1, touch2);
      
      if (this.initialDistance > 0) {
        const scale = currentDistance / this.initialDistance;
        const scaleDelta = scale - this.currentScale;
        
        if (Math.abs(scaleDelta) > this.options.pinchThreshold) {
          this.currentScale = scale;
          this.triggerEvent(scale > 1 ? 'pinchout' : 'pinchin', { scale, scaleDelta });
        }
      }
    }

    const touch = e.touches[0];
    this.triggerEvent('touchmove', { x: touch.clientX, y: touch.clientY });
  }

  handleTouchEnd(e) {
    // Clear timers
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    const touch = e.changedTouches[0];
    this.touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = this.touchEnd.x - this.touchStart.x;
    const deltaY = this.touchEnd.y - this.touchStart.y;
    const deltaTime = this.touchEnd.time - this.touchStart.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Handle swipe gestures
    if (distance > this.options.swipeThreshold && deltaTime < 800) {
      const direction = this.getSwipeDirection(deltaX, deltaY);
      this.triggerEvent('swipe', { direction, deltaX, deltaY, distance });
      this.triggerEvent(`swipe${direction}`, { deltaX, deltaY, distance });
    }

    // Handle tap gestures
    if (distance < 10 && deltaTime < this.options.tapDelay && !this.isLongPress) {
      if (this.tapTimeout) {
        // Double tap
        clearTimeout(this.tapTimeout);
        this.tapTimeout = null;
        this.triggerEvent('doubletap', { x: touch.clientX, y: touch.clientY });
      } else {
        // Single tap (with delay to check for double tap)
        this.tapTimeout = setTimeout(() => {
          this.triggerEvent('tap', { x: touch.clientX, y: touch.clientY });
          this.tapTimeout = null;
        }, this.options.tapDelay);
      }
    }

    this.isLongPress = false;
    this.currentScale = 1;
    this.triggerEvent('touchend', { x: touch.clientX, y: touch.clientY });
  }

  handleTouchCancel(e) {
    // Clear all timeouts
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
      this.tapTimeout = null;
    }
    
    this.isLongPress = false;
    this.currentScale = 1;
    this.triggerEvent('touchcancel', {});
  }

  getDistance(touch1, touch2) {
    const deltaX = touch1.clientX - touch2.clientX;
    const deltaY = touch1.clientY - touch2.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  triggerEvent(eventName, detail = {}) {
    const event = new CustomEvent(`gesture:${eventName}`, {
      detail: {
        ...detail,
        originalEvent: eventName,
        target: this.element
      },
      bubbles: true,
      cancelable: true
    });
    
    this.element.dispatchEvent(event);
  }

  destroy() {
    // Clear timeouts
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
    }
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }

    // Remove event listeners
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
  }
}

// React Hook for Touch Gestures
export const useTouchGestures = (ref, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    const gestureHandler = new TouchGestureHandler(ref.current, options);
    
    return () => {
      gestureHandler.destroy();
    };
  }, [ref, options]);
};

// Utility Functions
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

export const getDeviceType = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }
  
  if (window.innerWidth <= 768 || isTouchDevice()) {
    return 'mobile';
  }
  
  return 'desktop';
};

export const isStandalonePWA = () => {
  return (
    window.navigator.standalone ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
};

// Haptic Feedback for supported devices
export const triggerHapticFeedback = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
      success: [10, 50, 10],
      error: [50, 50, 50],
      warning: [20, 20, 20]
    };
    
    navigator.vibrate(patterns[type] || patterns.light);
  }
};

// Prevent zoom on double tap
export const preventDoubleZoom = (element) => {
  if (!element) return;
  
  let lastTouchEnd = 0;
  
  element.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

export default TouchGestureHandler;