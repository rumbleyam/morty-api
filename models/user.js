/**
 * User Model
 */

var schema = new require('mongoose').Schema({
	username : {
		type      : String,
		unique    : true,
		trim      : true,
		required  : true,
		lowercase : true
	},
	email : {
		type      : String,
		unique    : true,
		trim      : true,
		required  : true,
		lowercase : true
	},
	password : {
		type : String
	},
	role : {
		type : String,
		enum : ['user', 'admin'],
		default : 'user'
	},
	postCount : {
		type : Number,
		default : 0
	},
	deleted : {
		type    : Boolean,
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


module.exports = mongoose.model('user', schema);
