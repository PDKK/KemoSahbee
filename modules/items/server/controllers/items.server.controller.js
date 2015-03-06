'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Item = mongoose.model('Item'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a item
 */
exports.create = function(req, res) {
	var item = new Item(req.body);
	item.user = req.user;

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * Show the current item
 */
exports.read = function(req, res) {
	res.json(req.item);
};

/**
 * Update a item
 */
exports.update = function(req, res) {
	var item = req.item;

	item.title = req.body.title;
	item.content = req.body.content;
    item.nextAction = req.body.nextAction;
    item.project = req.body.project;

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * Delete an item
 */
exports.delete = function(req, res) {
	var item = req.item;

	item.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * List of Items
 */
exports.list = function(req, res) {
    console.log(req.param('nextAction'));
    console.log(req.param());
    var criteria = {};
    if (req.param('nextAction') === 'true') {
        criteria.nextAction = true;
    }
    console.log(criteria);
	Item.find(criteria).sort('-created').populate('user', 'displayName').exec(function(err, items) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(items);
		}
	});
};

/**
 * List of Items
 */
exports.inbox = function(req, res) {

    var criteria = {
        nextAction:false,
        project:false

    };

    console.log(criteria);
    Item.find(criteria).sort('-created').populate('user', 'displayName').exec(function(err, items) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(items);
        }
    });
};




/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {
	Item.findById(id).populate('user', 'displayName').exec(function(err, item) {
		if (err) return next(err);
		if (!item) return next(new Error('Failed to load item ' + id));
		req.item = item;
		next();
	});
};
