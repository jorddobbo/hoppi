<script src="https://unpkg.com/lenis@1.2.3/dist/lenis.min.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js" integrity="sha512-Ysw1DcK1P+uYLqprEAzNQJP+J4hTx4t/3X2nbVwszao8wD+9afLjBQYjz7Uk4ADP+Er++mJoScI42ueGtQOzEA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/protonet-jquery.inview/1.1.2/jquery.inview.min.js"></script>

<script>

document.addEventListener('DOMContentLoaded', function () {

	const lenis = new Lenis();
  
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
      {selector: '.s-usp-slider_swiper',
      	options: {
        	effect: 'fade',
        	slidesPerView: 'auto',
          spaceBetween: 16,
          loop: true,
          centeredSlides: true,
          easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
        }
      },
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
   
</script>