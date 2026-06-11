/* ----------------------------------------------------
   ROBUCCA COFFEE SHOP — Main JavaScript Controller
   Malang, Indonesia
   ---------------------------------------------------- */

// 1. Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }

  // 2. Sticky Navbar Background Scroll Transition
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('bg-rbc-green-d/95', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.remove('bg-rbc-green');
      } else {
        navbar.classList.remove('bg-rbc-green-d/95', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.add('bg-rbc-green');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially in case page loaded scrolled down
  }

  // 3. Stats Counter Animation using Intersection Observer
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length > 0) {
    const runCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        
        const currentValue = Math.floor(easeProgress * target);
        const suffix = counter.getAttribute('data-suffix') || '';
        counter.innerText = currentValue + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.innerText = target + suffix;
        }
      };
      
      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(counter => {
      // Set initial state to 0
      const suffix = counter.getAttribute('data-suffix') || '';
      counter.innerText = '0' + suffix;
      observer.observe(counter);
    });
  }
});

// 4. Register Alpine.js Data Structures
document.addEventListener('alpine:init', () => {
  
  // Hero Carousel Logic
  Alpine.data('heroCarousel', () => ({
    activeSlide: 0,
    totalSlides: 3,
    intervalId: null,
    
    init() {
      this.startAutoPlay();
    },
    
    next() {
      this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
    },
    
    prev() {
      this.activeSlide = (this.activeSlide - 1 + this.totalSlides) % this.totalSlides;
    },
    
    setSlide(index) {
      this.activeSlide = index;
    },

    shuffle() {
      let nextIndex = this.activeSlide;
      while (nextIndex === this.activeSlide) {
        nextIndex = Math.floor(Math.random() * this.totalSlides);
      }
      this.activeSlide = nextIndex;
    },
    
    startAutoPlay() {
      this.stopAutoPlay();
      this.intervalId = setInterval(() => {
        this.shuffle();
      }, 4000);
    },
    
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }));

  // Mobile Drawer Navigation
  Alpine.data('mobileNav', () => ({
    isOpen: false,
    
    toggle() {
      this.isOpen = !this.isOpen;
      // Prevent body scrolling when open
      if (this.isOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    },
    
    close() {
      this.isOpen = false;
      document.body.classList.remove('overflow-hidden');
    }
  }));

  // Full Menu Filtering System
  Alpine.data('menuFilter', () => ({
    activeCategory: 'ALL',
    
    setCategory(category) {
      this.activeCategory = category;
      // Refresh AOS trigger positions since content heights will shift
      setTimeout(() => {
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }, 100);
    },
    
    isMatch(category) {
      return this.activeCategory === 'ALL' || this.activeCategory === category;
    }
  }));

  // Contact Page WA Form Generator
  Alpine.data('contactForm', () => ({
    name: '',
    waNumber: '',
    location: 'Soehat (Malang)',
    message: '',
    
    submitForm() {
      if (!this.name.trim()) {
        alert('Mohon masukkan nama Anda.');
        return;
      }
      if (!this.message.trim()) {
        alert('Mohon tulis pesan Anda.');
        return;
      }

      const waURL = 'https://wa.me/6287741848928';
      const formattedMsg = `Halo Robucca, saya *${this.name}* (WA: ${this.waNumber || '-'}). Saya ingin menghubungi Anda terkait cabang *${this.location}*.\n\n*Pesan:* ${this.message}`;
      
      const fullURL = `${waURL}?text=${encodeURIComponent(formattedMsg)}`;
      window.open(fullURL, '_blank');
      
      // Clear form
      this.name = '';
      this.waNumber = '';
      this.message = '';
    }
  }));
});
