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