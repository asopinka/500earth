angular.module('500map.controllers', ['ngMaterial', 'ngPlacesAutocomplete'])

.controller('MapCtrl', function($rootScope, $scope, $window, uiGmapGoogleMapApi, $mdSidenav, $http) {
    var map;

    uiGmapGoogleMapApi.then(function(map) {
    	this.map = map;
    });

    var mapClick = function(map, eventName, args) {
    	$scope.$apply(function() {
			$scope.infoWindow.visible = false;
    	});
    };

	$scope.map = { 
		center: { latitude: 25, longitude: -10 },
		zoom: 3,
		options: {
			mapTypeControl: false,
			scrollwheel: true,
			styles: [
			  {
			    "featureType": "road.highway",
			    "elementType": "labels",
			    "stylers": [
			      { "visibility": "off" }
			    ]
			  },{
			    "featureType": "poi",
			    "elementType": "labels.text",
			    "stylers": [
			      { "visibility": "off" }
			    ]
			  },{
			    "featureType": "transit",
			    "stylers": [
			      { "visibility": "off" }
			    ]
			  }
			]
		},
		events: {
			click: mapClick
		}
	};

	$scope.selectedBatch = null;
	$scope.allStartups = [];
	$scope.mappedStartups = [];
	$scope.unmappedStartups = [];
	$scope.batches = [];

	$http.get('/api/startups').then(function(rsp) {
		if (rsp.data.ok) {
			$scope.allStartups = rsp.data.startups;
			$.each(rsp.data.startups, function(i, o) {
				// batch
				if (o.batch && $scope.batches.indexOf(o.batch) == -1) {
					$scope.batches.push(o.batch);
				}
			});

			// order the batches
			$scope.batches = $scope.batches.sort(function(a,b) {
				var aNum = a.substring(a.length - 3);
				var bNum = b.substring(b.length - 3);

		        if (aNum < bNum) {
		        	return -1;
		        }
		        else if (aNum > bNum) {
		        	return 1;
		        }
		        else {
		        	return 0;
		        }
			});

			filterStartups('All');
			$rootScope.isLoading = false;
		}
	}, function(err) {

	});

	$scope.batchChanged = function(val) {
		filterStartups(val ? val : 'All');
		$scope.toggleMenu();
	};

	$scope.markerClick = function(marker, eventName, model) {
    	$scope.infoWindow.coords = {};
    	$scope.infoWindow.coords.latitude = model.latitude;
    	$scope.infoWindow.coords.longitude = model.longitude;
    	$scope.infoWindow.visible = true;
    	$scope.infoWindow.startup = model.startup;

    	// image name
    	$scope.infoWindow.startup.getImageName = function(name) {
    		return name.replace(' ', '').toLowerCase();
    	};
	};

	$scope.infoWindow = {};
	$scope.infoWindow.visible = false;
	$scope.infoWindow.options = {
		pixelOffset: {
			height: -32,
			width: 0
		}
	};
	$scope.infoWindow.templateUrl = 'templates/infowindow.html';

	$scope.toggleMenu = function() {
		$scope.infoWindow.visible = false;
		$mdSidenav('left-menu').toggle();
	};

	$scope.poweredBy = function() {
		$window.open('http://obie.ai');
	};

	$scope.locationSelected = function(err, loc) {
		$scope.map.center = { latitude: loc.geometry.location.lat(), longitude: loc.geometry.location.lng() };
		$scope.map.zoom = 12;
	};

	function filterStartups(batch) {
		$scope.mappedStartups = [];
		$scope.unmappedStartups = [];

		$.each($scope.allStartups, function(i,o) {
			// the marker (if we have lat/lng)
			if ((batch == 'All' || o.batch == batch) && o.lat && o.lng) {
				var s = {
					latitude: o.lat,
					longitude: o.lng,
					id: o._id,
					icon: '/map/pushpin.png',
					startup: o
				};
				s.startup.formatted_address = s.startup.address + '\r\n';
				s.startup.formatted_address += (s.startup.city != null ? s.startup.city + ', ' : '') + (s.startup.state != null ? s.startup.state : '') + '\r\n';
				s.startup.formatted_address += s.startup.zip != null ? s.startup.zip + '\r\n' : '';
				s.startup.formatted_address += s.startup.country;

				$scope.mappedStartups.push(s);
			}
			else if (batch == 'All' || o.batch == batch) {
				var s = {
					id: o._id,
					icon: '/map/pushpin.png',
					startup: o
				};
				s.startup.formatted_address = s.startup.address + '\r\n';
				s.startup.formatted_address += (s.startup.city != null ? s.startup.city + ', ' : '') + (s.startup.state != null ? s.startup.state : '') + '\r\n';
				s.startup.formatted_address += s.startup.zip != null ? s.startup.zip + '\r\n' : '';
				s.startup.formatted_address += s.startup.country;

				$scope.unmappedStartups.push(s);
			}
		});
	}
});