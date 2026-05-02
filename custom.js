document.addEventListener('DOMContentLoaded', function () {

	const lenis = new Lenis();

	// =============================================
// Hoppi USP Slider — Custom JS
// Place in Webflow Page Settings > Before </body>
// Requires: Swiper already initialized on .s-usp-slider_swiper
// =============================================

(function () {
  // ------------------------------------------
  // Wait for Swiper to be ready
  // ------------------------------------------
  function initHoppiSlider() {
    const swiperEl = document.querySelector(".s-usp-slider_swiper");
    if (!swiperEl || !swiperEl.swiper) {
      // Swiper not yet initialized — retry
      requestAnimationFrame(initHoppiSlider);
      return;
    }

    const swiper = swiperEl.swiper;

    // ------------------------------------------
    // Side circle elements (prev / next)
    // These are the fixed decorative circles flanking the main slide.
    // Create them in Webflow and give them these classes,
    // OR the script will create them if absent.
    // ------------------------------------------
    let prevCircle = document.querySelector(".s-usp-side-circle--prev");
    let nextCircle = document.querySelector(".s-usp-side-circle--next");

    // If the designer hasn't added the side circles in Webflow,
    // we inject them. Otherwise this block is skipped.
    if (!prevCircle || !nextCircle) {
      const inner = document.querySelector(".s-usp-slider_inner");

      prevCircle = document.createElement("div");
      prevCircle.className = "s-usp-side-circle s-usp-side-circle--prev";

      nextCircle = document.createElement("div");
      nextCircle.className = "s-usp-side-circle s-usp-side-circle--next";

      inner.appendChild(prevCircle);
      inner.appendChild(nextCircle);
    }

    // Each circle needs an inner image wrapper for the mask animation
    function ensureInner(circle) {
      let inner = circle.querySelector(".s-usp-side-circle_img-wrap");
      if (!inner) {
        inner = document.createElement("div");
        inner.className = "s-usp-side-circle_img-wrap";
        circle.appendChild(inner);
      }
      return inner;
    }

    const prevInner = ensureInner(prevCircle);
    const nextInner = ensureInner(nextCircle);

    // ------------------------------------------
    // Helper: get image src + srcset from a slide index
    // ------------------------------------------
    function getSlideImg(index) {
      const slides = swiper.slides;
      const total = slides.length;
      // Wrap around
      const i = ((index % total) + total) % total;
      const img = slides[i].querySelector(".s-usp-slide_img");
      if (!img) return null;
      return {
        src: img.src,
        srcset: img.srcset || "",
        alt: img.alt || "",
      };
    }

    // ------------------------------------------
    // Render an image into a side circle wrapper
    // ------------------------------------------
    function renderImg(wrapper, imgData) {
      if (!imgData) {
        wrapper.innerHTML = "";
        return;
      }
      // Reuse existing img if present, otherwise create
      let img = wrapper.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        img.className = "s-usp-side-circle_img";
        wrapper.appendChild(img);
      }
      img.src = imgData.src;
      if (imgData.srcset) img.srcset = imgData.srcset;
      img.alt = imgData.alt;
    }

    // ------------------------------------------
    // Update side circles to show prev/next images
    // ------------------------------------------
    function updateSideCircles(activeIndex) {
      const total = swiper.slides.length;
      const prevIndex = ((activeIndex - 1) % total + total) % total;
      const nextIndex = (activeIndex + 1) % total;

      renderImg(prevInner, getSlideImg(prevIndex));
      renderImg(nextInner, getSlideImg(nextIndex));
    }

    // ------------------------------------------
    // Slide-in animation via class toggling
    // Direction: 'next' slides new image in from right,
    //            'prev' slides new image in from left.
    // ------------------------------------------
    function animateSideCircle(circle, direction) {
      const wrap = circle.querySelector(".s-usp-side-circle_img-wrap");
      if (!wrap) return;

      // Remove any in-progress classes first
      wrap.classList.remove(
        "is-entering-next",
        "is-entering-prev",
        "is-entering"
      );

      // Force reflow to restart animation
      void wrap.offsetWidth;

      wrap.classList.add(
        direction === "next" ? "is-entering-next" : "is-entering-prev"
      );
      wrap.classList.add("is-entering");

      wrap.addEventListener(
        "animationend",
        () => {
          wrap.classList.remove(
            "is-entering-next",
            "is-entering-prev",
            "is-entering"
          );
        },
        { once: true }
      );
    }

    // ------------------------------------------
    // Hook into Swiper events using .on()
    // ------------------------------------------

    // Before transition: update images immediately so they're ready
    swiper.on("slideChangeTransitionStart", function () {
      const direction = swiper.swipeDirection || "next"; // 'next' | 'prev'
      updateSideCircles(swiper.realIndex);

      // Animate the side circle that's becoming more "active"
      if (direction === "next") {
        animateSideCircle(nextCircle, "next");
      } else {
        animateSideCircle(prevCircle, "prev");
      }
    });

    // After transition: re-sync to be safe (handles programmatic navigation)
    swiper.on("slideChangeTransitionEnd", function () {
      updateSideCircles(swiper.realIndex);
    });

    // Init on load
    updateSideCircles(swiper.realIndex);
  }

  // Kick off after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHoppiSlider);
  } else {
    initHoppiSlider();
  }
})();
  
  function parallax() {
  
    // Select the elements
    const parallaxItems = document.querySelectorAll('[data-parallax]');

    parallaxItems.forEach(item => {
        // Get the speed from the data-parallax-speed attribute
        let speed = parseFloat(item.getAttribute('data-parallax')) || 0.05;

        // Use GSAP to animate the translateY based on scroll
        gsap.to(item, {
            yPercent: speed * 100,  // Scroll position multiplier for parallax
            ease: 'none',           // Ensure no easing, for smooth parallax
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',  // When the top of the element hits the bottom of the viewport
                end: 'bottom top',    // When the bottom of the element hits the top of the viewport
                scrub: true,
            }
        });
    });
  
  } parallax();
  
  function logoCarousel() {
    $('.logo-carousel').each(function() {
        let track = $(this).find(".home-logos_track");
        let wrap = $(this).find(".home-logos_wrap");
        let logos = wrap.find(".home-logos_item-link, .testimonial-card"); // Get all logos

        // Clone wrap only if it hasn't been duplicated yet
        if (track.children(".home-logos_wrap").length === 1) {
            wrap.clone().appendTo(track);
        }

        // Get logo count
        let logoCount = logos.length;

        // Set animation duration dynamically based on logo count
        let speed = logoCount * 6; // Adjust multiplier as needed for speed tuning
        track.addClass("is-loaded").css("animation-duration", speed + "s");
    });
  }

  logoCarousel();

  function scrollInview() {

    const paragraph = $('[data-anim]');
    const lines = Splitting({ target: paragraph, by: 'lines' });

    $('.word').wrapInner( "<span class='text'></span>");

    // Play animation when scrolled into view
    $('[data-fade], .word, [data-line]').on('inview', function(event, isInView) {
      let _that = $(this);
      let time = 0;

      if($(this).attr('data-fade')) {
        time = $(_that).attr('data-fade');
      }

      if($(this).attr('data-line')) {
        time = $(_that).attr('data-line');
        console.log('data-line 1');
      }

      if (isInView) {
        setTimeout(function(){
          $(_that).addClass('viewed');
          console.log('data-line 2');
        }, time);
      }
    });
  } scrollInview();

	function smoothScroll() {

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);
  
  } smoothScroll();

 	function initSliders() {
    var configs = [
      {selector: '.s-image-slider' },
      /*{selector: '.s-usp-slider_swiper',
      	options: {
        	effect: 'fade',
        	slidesPerView: 'auto',
          spaceBetween: 16,
          loop: true,
          centeredSlides: true,
          easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
        }
      },*/
      {selector: '.s-previous-events_slider',
      	options: {
        	slidesPerView: 'auto',
          spaceBetween: 16,
          loop: true,
          centeredSlides: true,
          easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
        }
       }
    ];

    configs.forEach(({ selector, options = {} }) => {
      document.querySelectorAll(selector).forEach(el => {
        new Swiper(el, {
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 0,
          grabCursor: true,
          navigation: {
            nextEl: el.parentElement.querySelector('.is-next'),
            prevEl: el.parentElement.querySelector('.is-prev'),
          },
          pagination: {
            el: el.parentElement.querySelector('.swiper-pagination'),
            clickable: true,
          },
          ...options,
        });
      });
    });
  }

  initSliders();
   
   function menu() {

    $('body').on('click', '.menu-toggle', function(e) {
      e.preventDefault();

      if(!$('.menu').hasClass('is-active')) {
        e.preventDefault();
        $('.menu').addClass('is-active');
      }
    });

    $('body').on('click', '.menu_close', function(e) {
      $('.menu').removeClass('is-active');
    });

  } menu();
  
  function headerColour() {
  
  	const header = document.querySelector('.header');

    // Select all sections that should trigger the background change
    const sections = document.querySelectorAll('[bg-colour]');

    sections.forEach(section => {
        // Use ScrollTrigger to monitor when the section is in view
        ScrollTrigger.create({
            trigger: section, // The element to watch
            start: "top top",  // Trigger when the section hits the top of the viewport
            end: "bottom top", // Trigger when the section leaves the viewport
            onEnter: () => {
                // Get the value of the bg-colour attribute
                const bgColor = section.getAttribute('bg-colour');

                // Add a class to the header based on the bg-colour value
                header.classList.add(bgColor);
            },
            onLeave: () => {
                // Optionally, remove the class when you leave the section
                const bgColor = section.getAttribute('bg-colour');
                header.classList.remove(bgColor);
            },
            onEnterBack: () => {
                // Re-add the class if scrolling back up
                const bgColor = section.getAttribute('bg-colour');
                header.classList.add(bgColor);
            },
            onLeaveBack: () => {
                // Optionally, remove the class when leaving the section in reverse scroll
                const bgColor = section.getAttribute('bg-colour');
                header.classList.remove(bgColor);
            }
        });
    });
  
  } headerColour();


	function accordion() {
    $('.c-accordion-item').each(function () {
      const parent = $(this);
      parent.find('.c-accordion-item_answer').toggle(parent.hasClass('is-active'));
    });

    $('.c-accordion-item_top').on('click', function () {
      const parent = $(this).parent();
      const isActive = parent.hasClass('is-active');

      $('.c-accordion-item').removeClass('is-active');
      $('.c-accordion-item_answer').slideUp();

      if (!isActive) {
        parent.addClass('is-active');
        parent.find('.c-accordion-item_answer').slideDown();
      }
    });
  } accordion();
  
  function tabContent() {
    var tabs = $('.s-tab-content_tabs .s-tab-content_tab');
    var blocks = $('.s-tab-content_block').children();
    tabs.each(function(i) {
      $(this).toggleClass('is-active', i === 0);
    });
    blocks.each(function(i) {
      $(this).toggle(i === 0);
    });
    tabs.on('click', function() {
      var index = tabs.index(this);
      tabs.removeClass('is-active');
      $(this).addClass('is-active');
      blocks.hide().removeClass('is-active');
      $(blocks[index]).show().addClass('is-active');;
    });
  } tabContent();

  
  function pageTransition() {

    let transitionTrigger = true;
    let introDurationMS = 500;
    let exitDurationMS = 750;
    let excludedClass = "no-transition";

    // On Page Load
    if (transitionTrigger) {
      $("body").addClass("no-scroll-transition");
      setTimeout(() => {$("body").removeClass("no-scroll-transition");}, introDurationMS);
      $('.page-wrapper').addClass('loaded');
      
      lenis.stop();
  		lenis.start();
    }

    // On Link Click
    $("a").on("click", function (e) {
      if ($(this).prop("hostname") == window.location.host && $(this).attr("href").indexOf("#") === -1 && !$(this).hasClass(excludedClass) && $(this).attr("target") !== "_blank" && transitionTrigger) {
        e.preventDefault();

       console.log('page transition working');
       $('.page-wrapper').removeClass('loaded');

        let transitionURL = $(this).attr("href");
        setTimeout(function () {window.location = transitionURL;}, exitDurationMS);
      }
    });

    // On Back Button Tap
    window.onpageshow = function(event) {if (event.persisted) {window.location.reload()}};

    // Hide Transition on Window Width Resize
    setTimeout(() => {$(window).on("resize", function () {
    setTimeout(() => {
    	$(".transition").css("display", "none");
      lenis.stop();
  		lenis.start();
    }, 50);}); }, introDurationMS);
  } pageTransition();
  
  lenis.stop();
  $(document).ready(function(){lenis.start();})
   
});
