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

		newSlide.style.visibility = 'visible';
		newSlide.style.opacity = '0';
		newSlide.classList.add('next-active');

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
		if (!document.querySelector('.lightbox-overlay.open')) {
			setSize(false);
		}
	});

	// ========================================
	// Lightbox
	// ========================================

	var lbOverlay = document.createElement('div');
	lbOverlay.className = 'lightbox-overlay';
	lbOverlay.innerHTML =
		'<button class="lightbox-close" aria-label="Close"></button>' +
		'<button class="lightbox-arrow lightbox-arrow-prev" aria-label="Previous">' +
			'<svg viewBox="0 0 15 32" xmlns="http://www.w3.org/2000/svg"><path d="M14.464 27.84q0.832 0.832 0 1.536-0.832 0.832-1.536 0l-12.544-12.608q-0.768-0.768 0-1.6l12.544-12.608q0.704-0.832 1.536 0 0.832 0.704 0 1.536l-11.456 11.904z"/></svg>' +
		'</button>' +
		'<img src="" alt="" />' +
		'<button class="lightbox-arrow lightbox-arrow-next" aria-label="Next">' +
			'<svg viewBox="0 0 15 32" xmlns="http://www.w3.org/2000/svg"><path d="M0.416 27.84l11.456-11.84-11.456-11.904q-0.832-0.832 0-1.536 0.832-0.832 1.536 0l12.544 12.608q0.768 0.832 0 1.6l-12.544 12.608q-0.704 0.832-1.536 0-0.832-0.704 0-1.536z"/></svg>' +
		'</button>' +
		'<span class="lightbox-counter"></span>';
	document.body.appendChild(lbOverlay);

	var lbImg = lbOverlay.querySelector('img');
	var lbCounter = lbOverlay.querySelector('.lightbox-counter');
	var lbIndex = 0;

	function getFullSrc(index) {
		var img = slides[index].querySelector('img');
		return img ? img.src : '';
	}

	function openLightbox(index) {
		lbIndex = index;
		lbImg.classList.remove('loaded');
		lbImg.src = getFullSrc(lbIndex);
		lbImg.alt = slides[lbIndex].querySelector('img').alt || '';
		lbCounter.textContent = (lbIndex + 1) + ' / ' + slides.length;
		lbOverlay.classList.add('open');
		document.body.style.overflow = 'hidden';
		lbImg.onload = function () { lbImg.classList.add('loaded'); };
		if (lbImg.complete) lbImg.classList.add('loaded');
		stopAutoplay();
	}

	function closeLightbox() {
		lbOverlay.classList.remove('open');
		document.body.style.overflow = '';
		startAutoplay();
	}

	function lbNav(dir) {
		if (dir === 'next') {
			lbIndex = lbIndex < slides.length - 1 ? lbIndex + 1 : 0;
		} else {
			lbIndex = lbIndex > 0 ? lbIndex - 1 : slides.length - 1;
		}
		lbImg.classList.remove('loaded');
		lbImg.src = getFullSrc(lbIndex);
		lbImg.alt = slides[lbIndex].querySelector('img').alt || '';
		lbCounter.textContent = (lbIndex + 1) + ' / ' + slides.length;
		lbImg.onload = function () { lbImg.classList.add('loaded'); };
		if (lbImg.complete) lbImg.classList.add('loaded');
	}

	// Click on slide image to open lightbox
	for (var s = 0; s < slides.length; s++) {
		(function (idx) {
			var slideImg = slides[idx].querySelector('img');
			if (slideImg) {
				slideImg.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					openLightbox(idx);
				});
			}
			var slideLink = slides[idx].querySelector('a');
			if (slideLink) {
				slideLink.addEventListener('click', function (e) {
					e.preventDefault();
				});
			}
		})(s);
	}

	lbOverlay.querySelector('.lightbox-close').addEventListener('click', function (e) {
		e.stopPropagation();
		closeLightbox();
	});
	lbOverlay.querySelector('.lightbox-arrow-prev').addEventListener('click', function (e) {
		e.stopPropagation();
		lbNav('prev');
	});
	lbOverlay.querySelector('.lightbox-arrow-next').addEventListener('click', function (e) {
		e.stopPropagation();
		lbNav('next');
	});
	lbOverlay.addEventListener('click', function (e) {
		if (e.target === lbOverlay) closeLightbox();
	});

	document.addEventListener('keydown', function (e) {
		if (!lbOverlay.classList.contains('open')) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowRight') lbNav('next');
		if (e.key === 'ArrowLeft') lbNav('prev');
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
