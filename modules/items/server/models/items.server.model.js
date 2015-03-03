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
        type : String,
        default: '',
        trim: true
    },
    waitingFor: {
        type : String,
        default: '',
        trim: true
    }
});

mongoose.model('Item', ItemSchema);
