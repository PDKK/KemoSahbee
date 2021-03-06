'use strict';

/**
 * Module dependencies.
 */
var itemsPolicy = require('../policies/items.server.policy.js'),
	items = require('../controllers/items.server.controller.js');

module.exports = function(app) {
	// Items collection routes
	app.route('/api/items').all(itemsPolicy.isAllowed)
		.get(items.list)
		.post(items.create);

    app.route('/api/inbox').all(itemsPolicy.isAllowed)
        .get(items.inbox);

    app.route('/api/projects').all(itemsPolicy.isAllowed)
        .get(items.projects);

    app.route('/api/waitingFor').all(itemsPolicy.isAllowed)
        .get(items.waitingFor);


    // Single item routes
	app.route('/api/items/:itemId').all(itemsPolicy.isAllowed)
		.get(items.read)
		.put(items.update)
		.delete(items.delete);

    app.route('/api/children/:itemId').all(itemsPolicy.isAllowed)
        .get(items.children);

	// Finish by binding the item middleware
	app.param('itemId', items.itemByID);
};
