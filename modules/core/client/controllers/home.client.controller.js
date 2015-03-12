'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Items',
	function($scope, $location, Authentication, Items) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.homeInit = function () {
            $scope.nextActions = Items.query({nextAction:true});
            $scope.inbox = Items.inbox();
            $scope.projects = Items.projects();
            $scope.waitingFor = Items.waitingFor();
        };

        $scope.newItem = function() {
            var item = new Items({
                title: $scope.newItemName

            });
            item.$save(function(response) {
                //$location.path('');
                $scope.inbox = Items.inbox();
                $scope.newItemName = '';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	}
]);
