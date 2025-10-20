// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  init() {
    this.applyTheme();
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.theme);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const icon = this.themeToggle.querySelector('i');
    icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// Particle System
class ParticleSystem {
  constructor() {
    this.container = document.getElementById('particles');
    this.particles = [];
    this.init();
  }

  init() {
    for (let i = 0; i < 20; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    this.container.appendChild(particle);
  }
}

// Scroll Progress
class ScrollProgress {
  constructor() {
    this.progressBar = document.querySelector('.scroll-progress');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateProgress());
  }

  updateProgress() {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    this.progressBar.style.width = scrolled + '%';
  }
}

// Skill Animation
class SkillAnimator {
  constructor() {
    this.skillBars = document.querySelectorAll('.skill-progress');
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.getAttribute('data-width');
            setTimeout(() => {
              skillBar.style.width = width + '%';
            }, 300);
            this.observer.unobserve(skillBar);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.skillBars.forEach(bar => this.observer.observe(bar));
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.section, .project-card, .education-card, .experience-card');
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.elements.forEach(element => {
      element.classList.add('loading');
      this.observer.observe(element);
    });
  }
}

// Toast Notifications
class ToastManager {
  constructor() {
    this.toasts = [];
  }

  show(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    this.toasts.push(toast);

    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }, duration);
  }
}

// Copy to Clipboard
class ClipboardManager {
  constructor() {
    this.toastManager = new ToastManager();
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) {
        const copyBtn = e.target.closest('.copy-btn');
        const text = copyBtn.getAttribute('data-copy');
        this.copyToClipboard(text);
      }
    });
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.toastManager.show('Đã sao chép vào clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.toastManager.show('Đã sao chép vào clipboard!');
    }
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.toastManager = new ToastManager();
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (this.validateForm(data)) {
      // Simulate form submission
      this.submitForm(data);
    }
  }

  validateForm(data) {
    const { name, email, subject, message } = data;
    
    if (!name || name.trim().length < 2) {
      this.toastManager.show('Vui lòng nhập họ tên hợp lệ', 'error');
      return false;
    }
    
    if (!this.isValidEmail(email)) {
      this.toastManager.show('Vui lòng nhập email hợp lệ', 'error');
      return false;
    }
    
    if (!subject || subject.trim().length < 5) {
      this.toastManager.show('Vui lòng nhập chủ đề ít nhất 5 ký tự', 'error');
      return false;
    }
    
    if (!message || message.trim().length < 10) {
      this.toastManager.show('Vui lòng nhập tin nhắn ít nhất 10 ký tự', 'error');
      return false;
    }
    
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submitForm(data) {
    const submitBtn = this.form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      this.toastManager.show('Tin nhắn đã được gửi thành công!');
      this.form.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
}

// Scroll to Top
class ScrollToTop {
  constructor() {
    this.scrollTopBtn = document.getElementById('scrollTop');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.toggleVisibility());
    this.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
  }

  toggleVisibility() {
    if (window.pageYOffset > 300) {
      this.scrollTopBtn.classList.add('visible');
    } else {
      this.scrollTopBtn.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor loading performance
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
      
      // Add loaded class to body for CSS animations
      document.body.classList.add('loaded');
      
      // Animate elements after load
      this.animateOnLoad();
    });
  }

  animateOnLoad() {
    const elements = document.querySelectorAll('.loading');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('loaded');
      }, index * 100);
    });
  }
}

// Responsive Handler
class ResponsiveHandler {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    };
    this.init();
  }

  init() {
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize(); // Initial call
  }

  handleResize() {
    const width = window.innerWidth;
    
    // Update CSS custom properties based on screen size
    if (width < this.breakpoints.mobile) {
      document.documentElement.style.setProperty('--container-padding', '1rem');
      document.documentElement.style.setProperty('--section-padding', '3rem 1rem');
    } else if (width < this.breakpoints.tablet) {
      document.documentElement.style.setProperty('--container-padding', '2rem');
      document.documentElement.style.setProperty('--section-padding', '4rem 2rem');
    } else {
      document.documentElement.style.setProperty('--container-padding', '2rem');
      document.documentElement.style.setProperty('--section-padding', '6rem 2rem');
    }
  }
}

// Lazy Loading Images
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              this.imageObserver.unobserve(img);
            }
          });
        }
      );

      this.images.forEach(img => this.imageObserver.observe(img));
    }
  }
}

// Accessibility Enhancements
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    // Add focus indicators
    this.addFocusIndicators();
    
    // Handle reduced motion preference
    this.handleReducedMotion();
    
    // Add skip links
    this.addSkipLinks();
    
    // Improve keyboard navigation
    this.improveKeyboardNav();
  }

  addFocusIndicators() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid var(--primary-color)';
        element.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });
  }

  handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  improveKeyboardNav() {
    // Add proper ARIA labels and roles
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      section.setAttribute('role', 'region');
      section.setAttribute('aria-labelledby', `section-title-${index}`);
      
      const title = section.querySelector('.section-title');
      if (title) {
        title.id = `section-title-${index}`;
      }
    });
  }
}

// Main Application
class CVApp {
  constructor() {
    this.init();
  }

  init() {
    // Initialize all modules
    new ThemeManager();
    new ParticleSystem();
    new ScrollProgress();
    new SkillAnimator();
    new ScrollAnimations();
    new ClipboardManager();
    new ContactForm();
    new ScrollToTop();
    new SmoothScroll();
    new PerformanceMonitor();
    new ResponsiveHandler();
    new LazyLoader();
    new AccessibilityManager();

    // Add main content ID for accessibility
    const container = document.querySelector('.container');
    if (container) {
      container.id = 'main-content';
    }

    console.log('🎉 CV App initialized successfully!');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CVApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Restart animations when page becomes visible
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      particle.style.animation = 'none';
      particle.offsetHeight; // Trigger reflow
      particle.style.animation = null;
    });
  }
});

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}