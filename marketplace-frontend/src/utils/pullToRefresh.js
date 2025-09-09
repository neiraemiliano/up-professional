// Pull to Refresh Utility for Mobile Devices
import { triggerHapticFeedback } from './touchGestures';

export class PullToRefresh {
  constructor(element, onRefresh, options = {}) {
    this.element = element;
    this.onRefresh = onRefresh;
    this.options = {
      threshold: 80,
      maxPull: 120,
      resistance: 2.5,
      indicatorHeight: 60,
      ...options
    };

    this.isEnabled = true;
    this.isPulling = false;
    this.startY = 0;
    this.currentY = 0;
    this.pullDistance = 0;
    this.isRefreshing = false;

    this.indicator = null;
    this.createIndicator();
    this.init();
  }

  createIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.className = 'pwa-pull-refresh-indicator';
    this.indicator.innerHTML = `
      <div class="pwa-pull-refresh-spinner">
        <svg class="animate-spin h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Pull to refresh</span>
      </div>
    `;
    
    // Insert at the beginning of the element
    this.element.insertBefore(this.indicator, this.element.firstChild);
    this.indicator.style.transform = `translateY(-${this.options.indicatorHeight}px)`;
    this.indicator.style.transition = 'transform 0.3s ease-out';
  }

  init() {
    // Only enable on mobile devices
    if (!('ontouchstart' in window)) return;

    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  handleTouchStart(e) {
    if (!this.isEnabled || this.isRefreshing) return;

    // Only activate if scrolled to top
    if (this.element.scrollTop > 0) return;

    this.startY = e.touches[0].clientY;
    this.isPulling = true;
    this.indicator.style.transition = 'none';
  }

  handleTouchMove(e) {
    if (!this.isPulling) return;

    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.startY;

    // Only pull down
    if (deltaY > 0 && this.element.scrollTop === 0) {
      e.preventDefault();
      
      // Apply resistance
      this.pullDistance = Math.min(deltaY / this.options.resistance, this.options.maxPull);
      
      // Update indicator position
      const indicatorY = Math.max(0, this.pullDistance - this.options.indicatorHeight);
      this.indicator.style.transform = `translateY(${indicatorY}px)`;
      
      // Update indicator content based on pull distance
      const spinner = this.indicator.querySelector('.pwa-pull-refresh-spinner');
      if (this.pullDistance >= this.options.threshold) {
        spinner.innerHTML = `
          <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="ml-2 text-sm text-green-600 dark:text-green-400">Release to refresh</span>
        `;
        triggerHapticFeedback('light');
      } else {
        spinner.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Pull to refresh</span>
        `;
      }
    }
  }

  async handleTouchEnd() {
    if (!this.isPulling) return;

    this.isPulling = false;
    this.indicator.style.transition = 'transform 0.3s ease-out';

    if (this.pullDistance >= this.options.threshold && !this.isRefreshing) {
      await this.startRefresh();
    } else {
      this.resetIndicator();
    }

    this.pullDistance = 0;
  }

  async startRefresh() {
    this.isRefreshing = true;
    
    // Show loading state
    const spinner = this.indicator.querySelector('.pwa-pull-refresh-spinner');
    spinner.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-sm text-blue-600 dark:text-blue-400">Refreshing...</span>
    `;

    this.indicator.style.transform = `translateY(${this.options.indicatorHeight - this.options.indicatorHeight}px)`;
    
    triggerHapticFeedback('success');

    try {
      await this.onRefresh();
      
      // Show success briefly
      spinner.innerHTML = `
        <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="ml-2 text-sm text-green-600 dark:text-green-400">Refreshed!</span>
      `;
      
      setTimeout(() => {
        this.resetIndicator();
      }, 1000);
      
    } catch (error) {
      // Show error
      spinner.innerHTML = `
        <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="ml-2 text-sm text-red-600 dark:text-red-400">Refresh failed</span>
      `;
      
      setTimeout(() => {
        this.resetIndicator();
      }, 2000);
    }
  }

  resetIndicator() {
    this.isRefreshing = false;
    this.indicator.style.transform = `translateY(-${this.options.indicatorHeight}px)`;
    
    // Reset to default content
    const spinner = this.indicator.querySelector('.pwa-pull-refresh-spinner');
    spinner.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Pull to refresh</span>
    `;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    if (this.isPulling) {
      this.resetIndicator();
      this.isPulling = false;
    }
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    
    if (this.indicator && this.indicator.parentNode) {
      this.indicator.parentNode.removeChild(this.indicator);
    }
  }
}

// React Hook for Pull to Refresh
export const usePullToRefresh = (ref, onRefresh, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    const pullToRefresh = new PullToRefresh(ref.current, onRefresh, options);
    
    return () => {
      pullToRefresh.destroy();
    };
  }, [ref, onRefresh, options]);
};

export default PullToRefresh;