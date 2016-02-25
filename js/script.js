
    //getting the nav bar to stick. 
$(document).ready(function() {


  $(window).scroll(function () {
              //console.log($(window).scrollTop())
              if ($(window).scrollTop() > 243) {
                  $('#searchForm').removeClass('form-group').addClass('form-group-fixed');
              }
              if ($(window).scrollTop() < 243) {
                  $('#searchForm').removeClass('form-group-fixed').addClass('form-group');
              }
          });
});

        // key authentication begin

        var auth = {
                // Yelp keys and tokens
                consumerKey : "VP4buuF7sj7C57kDOH6sDA",
                consumerSecret : "5U95kCGUarDzJuXWu9jv_R2CUwY",
                accessToken : "eEiiUV5QjwGiCViFaC3u1cJHYgdvuK0d",
                accessTokenSecret : "xw9On4x8N8hePN_GhGJ7_ky98qw",
                serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
                }
            };


            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            // key authentication end

            $('#newSearch').hide();

            $(".btn").on("click", function(e) {
                e.preventDefault()

                var $myMusicInput = $("#musicGenre");
                var $myLocationInput = $("#city");
                var terms = $myMusicInput.val();
                var near = $myLocationInput.val();

                parameters.push(['term', terms]);
                parameters.push(['location', near]);

                var message = {
                    'action' : 'http://api.yelp.com/v2/search',
                    'method' : 'GET',
                    'parameters' : parameters

                };

                OAuth.setTimestampAndNonce(message);
                OAuth.SignatureMethod.sign(message, accessor);

                var parameterMap = OAuth.getParameterMap(message.parameters);
                console.log(parameterMap);

                $.ajax({
                    'url' : message.action,
                    'data' : parameterMap,
                    'dataType' : 'jsonp',
                    'jsonpCallback' : 'cb',
                    'cache': true,
                    success : function( data, textStats, XMLHttpRequest ) {
                        console.log( data )
                        var sOptions = "";
                        aBusinesses = data.businesses;

                        var sBusinessesLocationLatitude = "";
                        var sBusinessesLocationLongitude = "";

                        // Business Addresses
                        var aBusinessAddress = [];
                        var aMarkerAddresses = [];

                        $.each( aBusinesses, function( index, oBusiness ) {

                            // aBusinesses = value;
                            
                            var sLatitude = oBusiness.location.coordinate.latitude;
                            var sLongitude = oBusiness.location.coordinate.longitude;


                            // Business Addresses

                            var aBusinessAddress = oBusiness.location.address[0]; 

                            sOptions += "<div class='col-md-4'><div class='panel panel-default'><div class='panel-heading' style='background-color:black; color:white;'><h4>" 
                            + oBusiness.name + "</h4></div><div class='panel-body'><p>"+ "<div class='thumbnail' style='background-color:whitesmoke;'><img src="
                            +oBusiness.image_url+" class='img-rounded' style='width:150px;'></div>" + oBusiness.location.address[0] + 
                            "<br><br> <p class='text-snippet'>" + oBusiness.snippet_text + 
                            "</p> <br> <span class='glyphicon glyphicon-phone-alt' aria-hidden='true'></span>" 
                            + oBusiness.display_phone + "<br><br>" + "<img src="+oBusiness.rating_img_url_large + "></p><a href='" 
                            + oBusiness.url + "' class='btn btn-default'>Find Out More..</a></div></div></div>";

                            sBusinessesLocationLatitude += "<li>" + sLatitude + "</li>";
                            sBusinessesLocationLongitude += "<li>" + sLongitude + "</li>";

                            //console.log (sLatitude + " - "+sLongitude);

                            // Business Addresses
                            
                                var map;
                                var elevator;
                                var myOptions = {
                                    zoom: 13,
                                    center: new google.maps.LatLng(sLatitude, sLongitude),
                                    mapTypeId: 'terrain'
                                };
                                map = new google.maps.Map($('#map_canvas')[0], myOptions);

                                aMarkerAddresses.push(sLatitude+", "+sLongitude)

                                console.log(aMarkerAddresses);

                                for (var i=0; i<aMarkerAddresses.length; i++) {
                                    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+aMarkerAddresses[i]+'&sensor=false', null, function (data) {
                                        var p = data.results[0].geometry.location
                                        var latlng = new google.maps.LatLng(p.lat, p.lng);
                                        new google.maps.Marker({
                                            position: latlng,
                                            map: map
                                        });
                                    });
                                }

                        $("#content").html(sOptions);

                              /*  $('button').hide("");
                              $('#newSearch').show("slow"); */

                        window.onbeforeunload = function() {
                            localStorage.setItem(terms, $myMusicInput.val());
                            localStorage.setItem(near, $myLocationInput.val());
                        }

                        window.onload = function() {

                            var terms = localStorage.getItem(terms);
                            if (terms !== null) $('#musicGenre').val(terms);

                            // ...

                            var near = localStorage.getItem(near);
                            if (near !== null) $('#city').val(near);
                        }

                        // var url = window.location.href;    
                        //     if (url.indexOf('?') > -1){
                        //        url += '&param=1'
                        //     }else{
                        //        url += '?param=1'
                        //     }
                        //     window.location.href = url; 
                  });
                }  
            });

            /* This makes my "GO" button snap to search results */

            });

            $(".btn").on("click", function(e) {
                e.preventDefault()

                $("body, html").animate({ 
                    scrollTop: $( $(this).attr('href') ).offset().top 
                }, "slow");

            });

           /* $("#newSearch").on("click", function(e) {
                e.preventDefault()

                $('button').show(""); 

            });*/


