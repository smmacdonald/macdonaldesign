(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Common tweaks for the theme.
   *
   * @type {{attach: Drupal.behaviors.flexSliderInit.attach}}
   */
  Drupal.behaviors.commnTweaks = {
    attach: function (context, settings) {

      /**
       * background image paralax effect
      **/
      $(window).on('load', function(){
        $('.full-width-img-section',context).once('commnTweaks').each(function(){
          var $img_section = $(this);
          if ( !$img_section.hasClass('init') ) {
            $img_section.css({
              'background-position':'center center'
            })
          } else {
            var controller = new ScrollMagic.Controller(),
                $scroll_duration = $(window).height() + $img_section.outerHeight(),
                paragraph_id = '#'+$img_section.attr('id'),
                scroll_speed = ( $img_section.data('parallax-speed') == '' ) ? '5' : $img_section.data('parallax-speed');

          	// build scene
          	var scene = new ScrollMagic.Scene({
            	    triggerElement: paragraph_id,
            	    duration: $scroll_duration,
            	    triggerHook: 'onEnter'
            })
  					.addTo(controller)
  					// .addIndicators() // remove for production
  					.on("progress", function (e) {
  						$img_section.css('background-position', 'center ' + (e.progress.toFixed(2) * (100 / scroll_speed)) + '%');
  					});
          }
        });
      });


			/**
			 * Isotope with imagesLoaded
			**/
			$('.view-id-projects.view-display-id-block_1',context).once('commnTweaks').each(function(){

        var $grid = $(this).children('.view-content'),
            $checkboxes = $(this).find('.filter-item'),
            $reset = $(this).find('.isotope-reset');

				$grid.isotope({
				  // set itemSelector so .grid-sizer is not used in layout
				  itemSelector: '.view-id-projects.view-display-id-block_1 >.view-content >.views-row',
				  percentPosition: true
				});

	      $grid.imagesLoaded().progress( function() {
	        $grid.isotope('layout');
	      });

        // bind filter button click
        $checkboxes.on('click',function(){
	        if ( ($(this).data('filter') === '.website') || $(this).parents('.level-2').length ) {
		        $($(this).data('filter')+'.level-2').removeClass('d-none');
	        } else {
		        $('.level-2').addClass('d-none');
	        }

          $grid.isotope({ filter: $(this).data('filter') });
        });

          // bind filter rest
          $reset.click(function(){
            $checkboxes.each(function(){
              $(this).removeClass('active');
            });
            $grid.isotope({ filter: '*' });
          });

			});


      /*
       * Video Tab Carousel
      */
      $('.page-node-type-project', context).once('slickSliderInit').each(function () {
        $(this).find('.portfolio-slider').slick({
          autoplay: true,
          autoplaySpeed: 5000,
          dots: true,
          infinite: true,
          speed: 300,
          adaptiveHeight: false
        });
			});

    }
  };


})(jQuery, Drupal, drupalSettings);
