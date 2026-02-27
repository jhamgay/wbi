(function () {
	// ========================================
	// Slideshow (Enfold-style fade with height animation)
	// ========================================

	var slideshow = document.querySelector('.slideshow');
	if (!slideshow) return;

	var slidesUl = slideshow.querySelector('.slideshow-slides');
	var slides = slideshow.querySelectorAll('.slide');
	var prevBtn = slideshow.querySelector('.prev-arrow');
	var nextBtn = slideshow.querySelector('.next-arrow');
	var interval = parseInt(slideshow.getAttribute('data-interval'), 10) || 5;
	var current = 0;
	var prev = 0;
	var isAnimating = false;
	var timer = null;
	var transitionSpeed = 450;

	function getSlideHeight(index) {
		var img = slides[index].querySelector('img');
		if (!img || !img.naturalWidth) return slidesUl.offsetHeight;
		var containerWidth = slidesUl.offsetWidth;
		return Math.floor(containerWidth * (img.naturalHeight / img.naturalWidth));
	}

	function setSize(animate) {
		var targetHeight = getSlideHeight(current);
		if (animate) {
			slidesUl.style.height = targetHeight + 'px';
		} else {
			slidesUl.style.transition = 'none';
			slidesUl.style.height = targetHeight + 'px';
			slidesUl.offsetHeight; // force reflow
			slidesUl.style.transition = '';
		}
	}

	function fade(direction) {
		var newSlide = slides[current];
		var oldSlide = slides[prev];

		oldSlide.style.transition = 'opacity ' + (transitionSpeed / 1000) + 's ease-in-out';
		newSlide.style.transition = 'opacity ' + (transitionSpeed / 1000) + 's ease-in-out';

		newSlide.classList.add('next-active');
		newSlide.style.opacity = '0';

		// Force reflow so the browser registers the starting opacity
		newSlide.offsetHeight;

		newSlide.style.opacity = '1';
		newSlide.classList.add('active');

		oldSlide.style.opacity = '0';

		setTimeout(function () {
			oldSlide.classList.remove('active', 'next-active');
			oldSlide.style.visibility = 'hidden';
			oldSlide.style.opacity = '0';
			newSlide.classList.remove('next-active');
			isAnimating = false;
		}, transitionSpeed + 50);
	}

	function navigate(direction, goTo) {
		if (isAnimating || slides.length < 2) return;
		isAnimating = true;

		prev = current;

		if (typeof goTo === 'number') {
			current = goTo;
		} else if (direction === 'next') {
			current = current < slides.length - 1 ? current + 1 : 0;
		} else {
			current = current > 0 ? current - 1 : slides.length - 1;
		}

		if (current === prev) {
			isAnimating = false;
			return;
		}

		setSize(true);
		fade(direction);
	}

	function startAutoplay() {
		stopAutoplay();
		timer = setInterval(function () {
			navigate('next');
		}, interval * 1000);
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
			navigate('prev');
			startAutoplay();
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', function (e) {
			e.preventDefault();
			navigate('next');
			startAutoplay();
		});
	}

	// Wait for the first image to load, then initialize
	var firstImg = slides[0].querySelector('img');
	function initSlideshow() {
		slides[0].classList.add('active');
		slides[0].style.visibility = 'visible';
		slides[0].style.opacity = '1';
		setSize(false);
		startAutoplay();
	}

	if (firstImg && firstImg.complete) {
		initSlideshow();
	} else if (firstImg) {
		firstImg.addEventListener('load', initSlideshow);
		firstImg.addEventListener('error', initSlideshow);
	} else {
		initSlideshow();
	}

	// Recalculate height on resize
	window.addEventListener('resize', function () {
		setSize(false);
	});

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
