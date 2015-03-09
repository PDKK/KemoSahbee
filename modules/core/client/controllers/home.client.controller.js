'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Items',
	function($scope, Authentication, Items) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.homeInit = function () {
            $scope.nextActions = Items.query({nextAction:true});
            $scope.inbox = Items.inbox();
            $scope.projects = Items.projects();
            $scope.waitingFor = Items.waitingFor();
        };
	}
]);
