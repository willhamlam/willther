(function(){
	$(function(){

		var APPID = '1xLcLN3c'; // Your Yahoo Application ID
		var DEG = 'c';  // c for celsius, f for fahrenheit

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

			
			
			$.getJSON(geoAPI,function(r){

				if(r.ResultSet.Found == 1){

					results = r.ResultSet.Results;
					city = results[0].city;
					code = results[0].statecode || results[0].countrycode;
					woeid = results[0].woeid;

					//weather API
					$.getJSON(weatherYQL.replace('WID',woeid), function(r){

						if(r.query.count == 1){

							//create the weather items in the #scroller UL

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
	});
})(jQuery);