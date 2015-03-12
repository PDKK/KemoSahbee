'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    nextAction: {
        type: Boolean,
        default: false
    },
    project: {
        type: Boolean,
        default: false
    },
    parent: {
        type : Schema.ObjectId,
        ref: 'items'
    },
    waitingFor: {
        type : String,
        default: '',
        trim: true
    },
    children: {
        type: Number,
        default: 0
    },
    childNextActions: {
        type: Number,
        default: 0
    }
});

mongoose.model('Item', ItemSchema);
