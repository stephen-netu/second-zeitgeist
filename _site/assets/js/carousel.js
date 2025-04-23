document.addEventListener('DOMContentLoaded', function() {
  // Find all quote slides
  const slides = document.querySelectorAll('.quote-slide');
  
  if (slides.length <= 1) return; // Don't set up carousel if there's only one slide
  
  // Create indicator container if it doesn't exist
  let indicatorsContainer = document.querySelector('.carousel-indicators');
  if (!indicatorsContainer) {
    indicatorsContainer = document.createElement('div');
    indicatorsContainer.classList.add('carousel-indicators');
    slides[0].parentNode.appendChild(indicatorsContainer);
  }
  
  // Create indicators
  for (let i = 0; i < slides.length; i++) {
    const indicator = document.createElement('button');
    indicator.classList.add('indicator');
    indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
    indicator.dataset.index = i;
    
    // Make the first indicator active
    if (i === 0) {
      indicator.classList.add('active');
    }
    
    indicatorsContainer.appendChild(indicator);
  }
  
  // Hide all slides except the first one
  slides.forEach((slide, index) => {
    if (index !== 0) {
      slide.style.display = 'none';
    }
  });
  
  // Set up auto-rotation
  let currentSlide = 0;
  const indicators = document.querySelectorAll('.indicator');
  
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.style.display = 'none';
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // Show the selected slide
    slides[index].style.display = 'block';
    
    // Add active class to the corresponding indicator
    indicators[index].classList.add('active');
    
    // Update current slide index
    currentSlide = index;
  }
  
  // Add click event listeners to indicators
  indicators.forEach(indicator => {
    indicator.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      showSlide(index);
      resetInterval(); // Reset the interval when manually changing slides
    });
  });
  
  // Function to rotate to the next slide
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }
  
  // Set up interval for auto-rotation
  let slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  
  // Function to reset interval
  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  // Add keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
      resetInterval();
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
      resetInterval();
    }
  });
}); 