(function($){
$(document).ready(function() {
	try {
		var TILDAPAGE_URL = window.location.href, TILDAPAGE_QUERY = '', TILDAPAGE_UTM='';
		if ( TILDAPAGE_URL.toLowerCase().indexOf('utm_') !== -1) {
			TILDAPAGE_URL = TILDAPAGE_URL.toLowerCase();
			TILDAPAGE_QUERY = TILDAPAGE_URL.split('?');
			TILDAPAGE_QUERY = TILDAPAGE_QUERY[1];
			if (typeof(TILDAPAGE_QUERY) == 'string') {
				var arPair,i,arParams = TILDAPAGE_QUERY.split('&');
				for(i in arParams) {
					arPair = arParams[i].split('=');
					if (arPair[0].substring(0,4) == 'utm_') {
						TILDAPAGE_UTM = TILDAPAGE_UTM + arParams[i]+'|||';
					}
				}

				if (TILDAPAGE_UTM.length > 0) {
					var date = new Date()
					date.setDate(date.getDate() + 30);
					document.cookie = "TILDAUTM="+encodeURIComponent(TILDAPAGE_UTM)+"; path=/; expires=" + date.toUTCString();
				}
			}

		}
	} catch(err) { }
});	
})(jQuery);