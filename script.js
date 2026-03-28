document.addEventListener('DOMContentLoaded', () => {

  // --- NAV SCROLL ---
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });


  // --- HERO WORD ANIMATION ---
  const words = document.querySelectorAll('#hero .word');

  words.forEach((word, i) => {
    setTimeout(() => {
      word.classList.add('word--visible');
    }, 200 + i * 130);
  });


  // --- CAROUSEL ---
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const counter = document.querySelector('.carousel-counter');
  const cards = document.querySelectorAll('.card');
  const totalCards = cards.length;
  let currentIndex = 0;

  function getCardWidth() {
    if (!cards[0]) return 280;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 20;
    return cards[0].offsetWidth + gap;
  }

  function updateCarousel() {
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    counter.textContent = `${currentIndex + 1}/${totalCards}`;
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    nextBtn.style.opacity = currentIndex === totalCards - 1 ? '0.3' : '1';
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Drag to scroll
  const wrapper = document.querySelector('.carousel-wrapper');
  let isDragging = false;
  let startX = 0;
  let dragMoved = false;

  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragMoved = false;
    startX = e.clientX;
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 5) dragMoved = true;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';

    const delta = e.clientX - startX;
    if (delta < -50 && currentIndex < totalCards - 1) {
      currentIndex++;
    } else if (delta > 50 && currentIndex > 0) {
      currentIndex--;
    }
    updateCarousel();
  });

  // Touch support
  let touchStartX = 0;

  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta < -50 && currentIndex < totalCards - 1) {
      currentIndex++;
      updateCarousel();
    } else if (delta > 50 && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }, { passive: true });

  // Init carousel state
  updateCarousel();


  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // --- CONTACT FORM ---
  const form = document.querySelector('.contact-form');
  const confirmation = document.querySelector('.form-confirmation');

  if (form && confirmation) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.opacity = '0';
      form.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        form.hidden = true;
        confirmation.hidden = false;
        confirmation.style.opacity = '0';
        confirmation.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            confirmation.style.opacity = '1';
          });
        });
      }, 300);
    });
  }


  // --- SCROLL REVEAL ---
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  sections.forEach(section => {
    if (section.id !== 'hero') {
      observer.observe(section);
    } else {
      section.classList.add('section--visible');
    }
  });

});
