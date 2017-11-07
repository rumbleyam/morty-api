/**
 * Post Model
 */

var schema = new require('mongoose').Schema({
	author : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
	},
	title : {
		type : String
	},
	description : {
		type : String
	},
	content : {
		type : String
	},
	slug : {
		type    : String,
		unique  : true,
		trim    : true,
		sparse  : true
	},
	categories : [
		{
			type : String
		}
	],
	tags : [
		{
			type : String,
			lowercase : true,
			trim : true
		}
	],
	template : {
		type : String,
		default : 'generic'
	},
	published : {
		type : Boolean,
		default : false
	},
	deleted : {
		type : Boolean,
		default : false
	}
});

schema.set('timestamps', true);

schema.set('toJSON', {
	getters  : true,
	virtuals : true
});

schema.set('toObject', {
	getters  : true,
	virtuals : true
});

schema.index({
	title       : 'text',
	description : 'text',
	content     : 'text'
});

/**
 * Register schema
 */
module.exports = mongoose.model('post', schema);
