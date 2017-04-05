angular.module('500map', ['ngResource', 'ngRoute', 'ngMaterial', 'uiGmapgoogle-maps', 'ngPlacesAutocomplete', '500map.controllers', '500map.services'])
.run(function($rootScope) {
	$rootScope.isLoading = true;

	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
})

.config(function($routeProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
	$locationProvider.html5Mode(true);

	uiGmapGoogleMapApiProvider.configure({
        key: config.MAP_KEY,
        scrollwheel: false
    });

	$routeProvider
		.when('/', {
			controller: 'MapCtrl',
			templateUrl: 'templates/map.html',
			title: '500 Earth'
		});
});