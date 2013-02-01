(function(){
	$(function(){

		// $('a').on('click',function(){
		// 	$('body').toggleClass('color');
		// 	$('.area-time').toggleClass('font-color');
		// 	// console.log('success');
		// })

		var APPID = '1xLcLN3c'; // Your Yahoo Application ID
		var DEG = 'c';  // c for celsius, f for fahrenheit
		var weatherNUM;

		var weatherIconMap = [
		'storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail',
		'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow',
		'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake',
		'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun',
		'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain',
		'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'
		];

		var weatherColorMap = [
		'0','','','','','','','','','','','','','','','','','','','','','','','','','','#419EB3','','','','','','','#333333','','','','','','','','','','','','','',''
		];

		//Does this browser support geolocation?
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
		} else {
			showError("Your browser does not support Geolocation!");
		}

		function locationSuccess(position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;

			var geoAPI = 'http://where.yahooapis.com/geocode?location='+lat+','+lon+'&flags=J&gflags=R&appid='+APPID;

			// console.log(geoAPI);   //get the geolocation's json;
			
			var wsql = 'select * from weather.forecast where woeid=WID and u="'+DEG+'"',
					weatherYQL = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(wsql)+'&format=json&callback=?',
					code, city, results, woeid;

			$('body').on('click', 'a', function(e){
				e.preventDefault();
			})
			
			$.getJSON(geoAPI,function(r){

				if(r.ResultSet.Found == 1){

					results = r.ResultSet.Results;
					city = results[0].city;
					code = results[0].statecode || results[0].countrycode;
					woeid = results[0].woeid;

					//weather API
					$.getJSON(weatherYQL.replace('WID',woeid), function(r){

						if(r.query.count == 1){

							//create the weather items in the #scroller UL\
							console.log(r);
							var item = r.query.results.channel.item.condition,
									loc = r.query.results.channel.location.city;
							addWeather(item.code,"now",item.temp,loc,0);
							// weatherColor(item.code,0);

							for(var i=0;i<2;i++){
								item = r.query.results.channel.item.forecast[i];
								addWeather(item.code,item.day,item.high,loc,i+1);
								// weatherColor(item.code,i+1);
							}
							window.slider = new Swipe(document.getElementById('slider'));
							var index = $('.day'+slider.getPos() ).attr('data-index');
							var changeColor = weatherColorMap[index];
							$('body').css({
								'background-color': changeColor
							})
							$('.area-time').css({
								'color': changeColor
							})
						}

					})
				}

			})
		} 

		function locationError(error) {
			switch(error.code) {
				case error.TIMEOUT:
					showError("A timeout occured!Please try again!");
					break;
				case error.POSITION_UNAVAILABLE:
					showError("We can't detect your location.Sorry!");
					break;
				case error.PERMISSION_DENIED:
					showError("Please allow geolocation access for this to work!");
					break;
				case error.UNKNOWN_ERROR:
					showError("An unknown error occured!");
					break;
			}
		}

		function showError(msg) {
			console.log(msg);
		}

		function addWeather(code,day,condition,loc,index){

			var markup = '<li data-index="'+ code +'" style=\"display:block\" class=\"day'+ index +'\">' +
						'<div class="slider-wrap">' +
							'<div class="slider-container">'+
								'<div class="col left">'+
									'<img class="woeid-icon" src=\"img/' + weatherIconMap[code] + '.png\" />'+
									'<h2 class="woeid-area">' + loc +'</h2>'+
								'</div>'+
								'<div class="col right">'+
									'<h1 class="area-tem">' + condition + '&deg;</h1>'+
									'<div class="area-time">' + day + '</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>'
			console.log(code);
			$('.weather-slider ul').append(markup);
					
		}

		$('.last-day').on('click',function(){
			slider.prev();
			var index = $('.day'+slider.getPos() ).attr('data-index');
			var changeColor = weatherColorMap[index];
			$('body').css({
				'background-color': changeColor
			})
			$('.area-time').css({
				'color': changeColor
			})
		});

		$('.next-day').on('click',function(){
			slider.next();
			var index = $('.day'+slider.getPos() ).attr('data-index');
			var changeColor = weatherColorMap[index];
			$('body').css({
				'background-color': changeColor
			})
			$('.area-time').css({
				'color': changeColor
			})
		});
	});
})(jQuery);