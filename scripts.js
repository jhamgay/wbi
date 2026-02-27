// ========================================
// Carousel / Slider Functionality
// ========================================

(function() {
	const carousel = document.querySelector('.carousel');
	const items = document.querySelectorAll('.carousel-item');
	const dots = document.querySelectorAll('.dot');
	const prevBtn = document.querySelector('.carousel-prev');
	const nextBtn = document.querySelector('.carousel-next');

	let currentIndex = 0;

	// Initialize carousel on page load
	function init() {
		if (items.length === 0) return;
		showSlide(currentIndex);
	}

	// Show slide at specific index
	function showSlide(index) {
		if (items.length === 0) return;

		// Wrap around
		if (index >= items.length) {
			currentIndex = 0;
		} else if (index < 0) {
			currentIndex = items.length - 1;
		} else {
			currentIndex = index;
		}

		// Update carousel items
		items.forEach((item, i) => {
			item.classList.remove('active');
			if (i === currentIndex) {
				item.classList.add('active');
			}
		});

		// Update dots
		dots.forEach((dot, i) => {
			dot.classList.remove('active');
			if (i === currentIndex) {
				dot.classList.add('active');
			}
		});
	}

	// Next slide
	function nextSlide() {
		showSlide(currentIndex + 1);
	}

	// Previous slide
	function prevSlide() {
		showSlide(currentIndex - 1);
	}

	// Event listeners for buttons
	if (prevBtn) {
		prevBtn.addEventListener('click', prevSlide);
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', nextSlide);
	}

	// Event listeners for dots
	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			showSlide(index);
		});
	});

	// Auto-advance carousel every 5 seconds (optional)
	// Uncomment below to enable auto-play
	/*
	setInterval(nextSlide, 5000);
	*/

	// Initialize on load
	init();
})();

// ========================================
// Footer Year Helper
// ========================================

(function() {
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}
})();

// ========================================
// Smooth scroll for navigation links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		const href = this.getAttribute('href');
		if (href !== '#') {
			e.preventDefault();
			const target = document.querySelector(href);
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth'
				});
			}
		}
	});
});
