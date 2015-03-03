'use strict';


module.exports = {
	app: {
		title: 'KemoSahbee',
		description: 'GTD implementation using MeanJS',
		keywords: 'MEAN, MEANJS, GTD',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};
