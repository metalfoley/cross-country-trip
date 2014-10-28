$(document).ready(function() {

    //////////FLICKR API////////////////
    function flickr(setID) {
        var flickrAPI = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=139b6d10e72c73c1567edadc8eaf800f&photoset_id=" + setID + "&extras=tags&privacy_filter=1&format=json&nojsoncallback=1";//&per_page=30&page=1

        function displayPhotos(data) { //CREATE LIST OF PHOTOS
                var photoset = "<ul id='gallery'>";
                $.each(data.photoset.photo, function(i, item) {
                    var img_src_small = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg"; //THUMBNAIL
                    var img_src_large = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_b.jpg"; //LARGE PHOTO
                    photoset += '<li data-tags="' + item.tags + '">';
                    photoset += '<a href ="' + img_src_large + '" class="bigphoto">';
                    photoset += '<img src="' + img_src_small + '"  alt="' + item.title + '"/></a></li>';
                }); //END LOOP
                photoset += "</ul>";
                $("#flickr").html(photoset);

                ///////CREATE FILTER BUTTONS///////////
                (function() {

                    var $imgs = $('#gallery li a img'); //STORES ALL IMAGES
                    var $list = $('#gallery li');
                    var $buttons = $('#buttons');
                    var $options = $('#mobilefilter');
                    var tagged = {};

                    $list.each(function() {
                        var img = this; //STORE IMAGE INTO IMG VARIABLE
                        var tags = $(this).data('tags'); //GET EACH IMAGES TAGS

                        if (tags) {
                            tags.split(',').forEach(function(tagName) {
                                if (tagged[tagName] == null) {
                                    tagged[tagName] = [];
                                }
                                tagged[tagName].push(img);
                            });
                        }
                    }); //END LOOP

                    $('<button/>', { ///CREATE A SHOW ALL BUTTON TO SHOW ALL IMAGES
                        text: 'Show All',
                        class: 'active',
                        click: function() {
                                $(this).addClass('active').siblings().removeClass('active');
                                $list.show();
                            } //END CLICK
                    }).appendTo($buttons); //ADDED BUTTON TO #BUTTONS

                    $('<option/>', { ///CREATE A SHOW ALL BUTTON TO SHOW ALL IMAGES
                        text: 'Show All',
                        change: function() {
                                $list.show();
                            } //END CLICK
                    }).appendTo($options); //ADDED BUTTON TO #BUTTONS

                    $.each(tagged, function(tagName) {
                        $('<button/>', { ///CREATE A BUTTON FOR EACH TAG
                            text: tagName + ' (' + tagged[tagName].length + ')', //NAME EACH BUTTON WITH TAG NAME
                            click: function() {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    $list.hide().filter(tagged[tagName]).show();
                                } //END CLICK
                        }).appendTo($buttons); //ADDED BUTTON TO #BUTTONS

                        $('<option/>', { ///CREATE AN OPTION FOR EACH TAG
                            text: tagName, //NAME EACH OPTION WITH TAG NAME
                            // change: function() {
                            //     $list.hide().filter(tagged[tagName]).show();
                            //     }//END CLICK
                        }).appendTo($options); //ADDED BUTTON TO #BUTTONS
                        $options.change(function() {
                            $list.hide().filter(tagged[tagName]).show();
                        });
                    }); //END OF LOOP
                }()); //END FUNCTION
            } //END DISPLAY PHOTOS

        $.getJSON(flickrAPI, displayPhotos).fail(function() {
            $("#flickr").append('<p>Sorry, the gallery was unable to load. Please try again.</p>');
        });
    }

      ///////FIND SET NUMBER
      (function() {
      var gallery = $('body').data('set');//SET IS FOUND IN BODY ELEMENT
      flickr(gallery); //Flickr ajax load set Cross Country Trip
    }());

    ///////Dropdown Menu For Mobile/////////
    (function() {
        var $states = $('#states'),
            $menu = $('.menu'),
            $statesSub = $('.navlist');
        enquire.register("screen and (max-width: 767px)", {
            match: function() {
                $menu.hide();
                $statesSub.hide();
                $('#nav div').off('click').on("click", function() {
                    $menu.toggle(); //Toggle the menu
                });
            },
            unmatch: function() { //back to normal for 768px window and bigger//
                $menu.show();
                $statesSub.show();
            }
        }, true);
    }());

    ///////////BACK TO TOP///////
    (function() {
        var $top = $('#backtotop');
        $top.hide();
        //FADE IN SCROLL TO TOP AFTER USER SCROLLS DOWN 100PX
        $(window).scroll(function() {
            if ($(this).scrollTop() > 250) {
                $top.fadeIn(300);
            } else {
                $top.fadeOut(300);
            }
        });

        //SCROLL BACK TO TOP WHEN USER CLICKS ON LINK
        $top.click(function() {
            $('body').animate({
                scrollTop: 0
            }, 1000);
            return false;
        });
    }()); //END FUNCTION

    ////////LIGHTBOX////////////////
    function lightbox() {
      var $overlay = $('<div id="overlay"></div>');
      var $img = $('<img>');
      var $caption = $("<figcaption></figcaption>");
      var $figure = $('<figure></figure>');
      // var $next = $('<button>Next</button>')

      $('body').append($overlay);
      $overlay.append($figure);
      $figure.append($img);
      $figure.append($caption);
      // $overlay.append($next);

      $('#flickr').on('click', 'a.bigphoto', function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        $img.attr("src", href);
        $overlay.show();
        var captionText = $(this).children('img').attr('alt');//CAPTURE ALT TEXT AS A CAPTION
        $caption.text(captionText);
        var src = $('.activelightimg').attr('src');//GET IMAGE SOURCE
        $img.addClass('activelightimg');
        $overlay.click(function(){
          $overlay.hide();
          $img.removeClass('activelightimg');
        });
      });
    }
    lightbox();


}); //END PAGE LOAD
