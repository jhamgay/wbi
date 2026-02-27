(function () {
	// ========================================
	// Slideshow
	// ========================================

	var slideshow = document.querySelector('.slideshow');
	if (!slideshow) return;

	var slides = slideshow.querySelectorAll('.slide');
	var prevBtn = slideshow.querySelector('.prev-arrow');
	var nextBtn = slideshow.querySelector('.next-arrow');
	var interval = parseInt(slideshow.getAttribute('data-interval'), 10) || 5;
	var current = 0;
	var timer = null;

	function showSlide(index) {
		if (slides.length === 0) return;

		if (index >= slides.length) index = 0;
		if (index < 0) index = slides.length - 1;

		current = index;

		for (var i = 0; i < slides.length; i++) {
			slides[i].classList.remove('active');
		}
		slides[current].classList.add('active');
	}

	function nextSlide() {
		showSlide(current + 1);
	}

	function prevSlide() {
		showSlide(current - 1);
	}

	function startAutoplay() {
		stopAutoplay();
		timer = setInterval(nextSlide, interval * 1000);
	}

	function stopAutoplay() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	if (prevBtn) {
		prevBtn.addEventListener('click', function (e) {
			e.preventDefault();
			prevSlide();
			startAutoplay();
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', function (e) {
			e.preventDefault();
			nextSlide();
			startAutoplay();
		});
	}

	showSlide(0);
	startAutoplay();

	// ========================================
	// Footer Year
	// ========================================

	var yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}

	// ========================================
	// Scroll to Top
	// ========================================

	var scrollBtn = document.getElementById('scrollTop');

	function toggleScrollBtn() {
		if (!scrollBtn) return;
		if (window.pageYOffset > 300) {
			scrollBtn.classList.add('visible');
		} else {
			scrollBtn.classList.remove('visible');
		}
	}

	window.addEventListener('scroll', toggleScrollBtn);
	toggleScrollBtn();

	if (scrollBtn) {
		scrollBtn.addEventListener('click', function (e) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}
})();
