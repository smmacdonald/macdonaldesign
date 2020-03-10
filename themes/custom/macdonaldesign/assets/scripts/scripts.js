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

    }
  };

})(jQuery, Drupal, drupalSettings);
