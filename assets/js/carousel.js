document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.quote-carousel-container');
  if (!container) return;

  const slides = container.querySelectorAll('.quote-slide');
  if (slides.length <= 1) return; // No carousel if only one slide

  // Create indicator container if it doesn't exist
  let indicatorsContainer = container.querySelector('.carousel-indicators');
  if (!indicatorsContainer) {
    indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add('carousel-indicators');
    container.appendChild(indicatorsContainer);
  }

  // Create indicators
  for (let i = 0; i < slides.length; i++) {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.classList.add('indicator');
    indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
    indicator.setAttribute('aria-controls', slides[i].id || `quote-slide-${i}`);
    indicator.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    indicator.dataset.index = i;
    if (i === 0) indicator.classList.add('active');
    indicatorsContainer.appendChild(indicator);
  }

  // Hide all slides except the first one and set ARIA
  slides.forEach((slide, index) => {
    const isActive = index === 0;
    slide.style.display = isActive ? 'block' : 'none';
    slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  // Stabilize container height to prevent layout shifts when slide heights vary
  function measureMaxSlideHeight() {
    let max = 0;
    slides.forEach((slide) => {
      const prev = {
        display: slide.style.display,
        position: slide.style.position,
        visibility: slide.style.visibility,
        left: slide.style.left,
        top: slide.style.top,
        width: slide.style.width,
      };
      // Temporarily show and overlay the slide to measure
      slide.style.display = 'block';
      slide.style.position = 'absolute';
      slide.style.visibility = 'hidden';
      slide.style.left = '0';
      slide.style.top = '0';
      slide.style.width = '100%';
      const h = slide.offsetHeight;
      if (h > max) max = h;
      // Restore original styles
      slide.style.display = prev.display;
      slide.style.position = prev.position;
      slide.style.visibility = prev.visibility;
      slide.style.left = prev.left;
      slide.style.top = prev.top;
      slide.style.width = prev.width;
    });
    return max;
  }

  function stabilizeCarouselMinHeight() {
    const maxHeight = measureMaxSlideHeight();
    if (maxHeight > 0) {
      container.style.minHeight = maxHeight + 'px';
    }
  }

  // Initial and responsive sizing
  stabilizeCarouselMinHeight();
  window.addEventListener('load', stabilizeCarouselMinHeight);
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(stabilizeCarouselMinHeight, 150);
  });

  let currentSlide = 0;
  const indicators = container.querySelectorAll('.indicator');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.style.display = isActive ? 'block' : 'none';
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
    indicators.forEach((indicator, i) => {
      const isActive = i === index;
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    currentSlide = index;
  }

  indicators.forEach(indicator => {
    indicator.addEventListener('click', function() {
      const index = parseInt(this.dataset.index, 10);
      showSlide(index);
      resetInterval();
    });
  });

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let slideInterval = null;
  function startInterval() {
    if (reduceMotion || slideInterval) return;
    slideInterval = setInterval(nextSlide, 5000);
  }
  function stopInterval() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }
  function resetInterval() {
    stopInterval();
    startInterval();
  }
  startInterval();

  // Pause on hover/focus and when page hidden
  container.addEventListener('mouseenter', stopInterval);
  container.addEventListener('mouseleave', startInterval);
  container.addEventListener('focusin', stopInterval);
  container.addEventListener('focusout', startInterval);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopInterval(); else startInterval();
  });

  // Keyboard navigation scoped to the carousel container
  container.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
      resetInterval();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
      resetInterval();
      e.preventDefault();
    } else if (e.key === 'Home') {
      showSlide(0);
      resetInterval();
      e.preventDefault();
    } else if (e.key === 'End') {
      showSlide(slides.length - 1);
      resetInterval();
      e.preventDefault();
    }
  });
});
 