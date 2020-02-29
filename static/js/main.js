(function($) {
    "use strict";   
    var cfg = {
        scrollDuration : 800, // smoothscroll duration
    },

    $WIN = $(window);
    // Add the User Agent to the <html>
    // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

    // svg fallback
    if (!Modernizr.svg) {
        $(".header-logo img").attr("src", "images/logo.png");
    }

   /* Preloader
    * -------------------------------------------------- */
    var clPreloader = function() {   
        $("html").addClass('cl-preload');
        $WIN.on('load', function() {
            //force page scroll position to top at page refresh
            $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('cl-preload');
            $("html").addClass('cl-loaded');
        
        });
    };

   /* Move header
    * -------------------------------------------------- */
    var clMoveHeader = function () {
        var hero = $('.page-hero'),
            hdr = $('header'),
            triggerHeight = hero.outerHeight() - 170;

        $WIN.on('scroll', function () {
            var loc = $WIN.scrollTop();
            if (loc > triggerHeight) {
                hdr.addClass('sticky');
            } else {
                hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.addClass('offset');
            } else {
                hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.addClass('scrolling');
            } else {
                hdr.removeClass('scrolling');
            }
        });
    };


    /* Mobile Menu
     * ---------------------------------------------------- */ 
    var clMobileMenu = function() {
        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');
        toggleButton.on('click', function(event){
            event.preventDefault();
            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });
        if (toggleButton.is(':visible')) nav.addClass('mobile');
        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });
        nav.find('a').on("click", function() {
            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });
    };


    /* Highlight the current section in the navigation bar
     * ------------------------------------------------------ */
    var clWaypoints = function() {
        var sections = $(".target-section"),
            navigation_links = $(".header-nav li a");
        sections.waypoint( {
            handler: function(direction) {
                var active_section;
                active_section = $('section#' + this.element.id);
                if (direction === "up") active_section = active_section.prevAll(".target-section").first();
                var active_link = $('.header-nav li a[href="#' + active_section.attr("id") + '"]');
                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");
            },
            offset: '25%'
        });   
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    var clSmoothScroll = function() {       
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);       
                e.preventDefault();
                e.stopPropagation();
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {

                // check if menu is open
                if ($('body').hasClass('menu-is-open')) {
                    $('.header-menu-toggle').trigger('click');
                }
                window.location.hash = target;
            });
        });
    };

   /* Alert Boxes
    * ------------------------------------------------------ */
    var clAlertBoxes = function() {
        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 
    };

   /* Initialize
    * ------------------------------------------------------ */
    (function clInit() {
        clPreloader();
        clMoveHeader();
        clMobileMenu();
        clSmoothScroll();
        clAlertBoxes();
        $WIN.on('resize', function() {
            clMoveHeader();
        });
    })();        
})(jQuery);