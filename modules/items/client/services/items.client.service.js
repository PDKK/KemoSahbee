'use strict';

//Items service used for communicating with the items REST endpoints
angular.module('items').factory('Items', ['$resource',
	function($resource) {
		return $resource('api/items/:itemId', {
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            inbox: {
                url: 'api/inbox',
                isArray: true
            },
            projects: {
                url: 'api/projects',
                isArray: true
            },
            waitingFor: {
                url: 'api/waitingFor',
                isArray: true
            },
            children: {
                url:'api/children/:itemId',
                isArray: true,
                itemId: '@_id'
            }
		});
	}
]);
