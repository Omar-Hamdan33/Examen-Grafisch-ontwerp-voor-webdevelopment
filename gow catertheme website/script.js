class SimpleSlider {
  constructor(slideSelector, nextSelector, prevSelector, dotsSelector = null) {
    this.slides = document.querySelectorAll(slideSelector);
    this.nextBtn = document.querySelector(nextSelector);
    this.prevBtn = document.querySelector(prevSelector);
    this.dotsContainer = dotsSelector ? document.querySelector(dotsSelector) : null;
    this.dots = [];
    this.current = 0;
    this.autoPlayInterval = null;
    
    if (this.slides.length === 0) return;
    
    this.init();
  }

  init() {
    this.createDots();
    this.bindEvents();
    this.show(0);
    this.startAutoPlay();
  }

  show(index) {
    if (index >= this.slides.length) index = 0;
    if (index < 0) index = this.slides.length - 1;

    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.current = index;
  }

  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    this.dots = [];

    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Ga naar slide ${i + 1}`);
      dot.setAttribute('type', 'button');
      
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        this.show(i);
        this.resetAutoPlay();
      });
      
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    });
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoPlay();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoPlay();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
        this.resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        this.next();
        this.resetAutoPlay();
      }
    });

    this.slides.forEach(slide => {
      slide.addEventListener('mouseenter', () => this.stopAutoPlay());
      slide.addEventListener('mouseleave', () => this.startAutoPlay());
    });
  }

  next() {
    this.show((this.current + 1) % this.slides.length);
  }

  prev() {
    this.show((this.current - 1 + this.slides.length) % this.slides.length);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

class MobileNavigation {
  constructor() {
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    if (this.navToggle && this.navMenu) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.navToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isOpen = this.navMenu.classList.contains('active');
    
    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    document.body.style.overflow = '';
  }
}

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm();
    });

    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
    });
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.submitForm();
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;

    field.classList.remove('error');
    this.removeErrorMessage(field);

    if (isRequired && !value) {
      this.showError(field, 'Dit veld is verplicht');
      isValid = false;
    } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showError(field, 'Voer een geldig e-mailadres in');
      isValid = false;
    } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
      this.showError(field, 'Voer een geldig telefoonnummer in');
      isValid = false;
    }

    return isValid;
  }

  showError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }

  removeErrorMessage(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  submitForm() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.';
    
    this.form.parentNode.insertBefore(successMessage, this.form);
    this.form.reset();
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SimpleSlider('.banner-slide', '.banner-next', '.banner-prev', '.banner-dots');
  new SimpleSlider('.theme-slide', '.next', '.prev', '.dots');
  new SimpleSlider('.review-slide', '.review-next', '.review-prev', '.review-dots');

  new MobileNavigation();

  new FormValidator('.contact-form');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.add('loading');
      setTimeout(() => {
        this.classList.remove('loading');
      }, 2000);
    });
  });
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
