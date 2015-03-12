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
 * Update the count for a parent
 */

var updateParents = function (id) {
    Item.count({parent:id}).exec(function(err,c) {
        console.log('Id:' + id + ', Count:' + c);
        Item.update({_id:id},{children:c}).exec(function(err, numberAffected, raw){
            // Empty update
        });

    });

    Item.count({parent:id, nextAction:true}).exec(function(err,c) {
        console.log('Id:' + id + ', nextAction:' + c);
        Item.update({_id:id},{childNextActions:c}).exec(function(err, numberAffected, raw){
            // Empty update
        });

    });

};

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

exports.children = function(req, res) {
    Item.find({parent:req.item._id}, function (err, children) {
        res.json(children);
    });
};

/**
 * Update a item
 */
exports.update = function(req, res) {
	var item = req.item;

    var parentsToUpdate = [];



    if (req.body.parent !== String(item.parent)) {
        // Parent changed, so need to recalculate counts
        console.log('Parent changed from' + item.parent + ' to ' + req.body.parent );
        if (item.parent !== null) {
            // Recalculate count for old parent
            parentsToUpdate.push(item.parent);
        }
        if (req.body.parent !== null) {
            // Recalculate count for new parent
            parentsToUpdate.push(req.body.parent);
        }
    } else if (req.body.nextAction !== item.nextAction && item.parent !== null) {
        // Child nextAction changed, so need to update parent
        parentsToUpdate.push(item.parent);
    }

	item.title = req.body.title;
	item.content = req.body.content;
    item.nextAction = req.body.nextAction;
    item.project = req.body.project;
    item.waitingFor = req.body.waitingFor;
    item.parent = req.body.parent;

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

            parentsToUpdate.forEach (function(entry) {
                    updateParents(entry);
            });

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
 * List of that are not nextActions, and not a project, and not waiting for
 */
exports.inbox = function(req, res) {

    var criteria = {
        nextAction:false,
        project:false,
        parent:null,
        waitingFor:{'$in': [null, '']}

    };

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
exports.projects = function(req, res) {

    var criteria = {
        project:true
    };

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

exports.waitingFor = function(req, res) {

    var criteria = {
        waitingFor:{'$nin': [null, '']}
    };

    Item.find(criteria).sort('waitingFor').populate('user', 'displayName').exec(function(err, items) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            /* Build this into an object, sorted by waiting for */
            var byName = [];
            var currentName = 'UNDEFINED';
            var currentObject;
            var waitingForLength = items.length;
            for (var i=0; i< waitingForLength; i++) {
                if (items[i].waitingFor !== currentName) {
                    currentName = items[i].waitingFor;
                    currentObject = { name: currentName, items:[] };
                    byName.push(currentObject);
                }
                currentObject.items.push(items[i]);
            }

            res.json(byName);
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
