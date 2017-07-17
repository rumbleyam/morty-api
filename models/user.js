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
		enum : ['user', 'author', 'editor', 'admin'],
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

schema.virtual('isAdmin').get(function () {
	return this.role === 'admin';
});

schema.virtual('isEditor').get(function () {
	return this.role === 'editor';
});

schema.virtual('isAuthor').get(function () {
	return this.role === 'author';
});

schema.index({
	username : 'text',
	email    : 'text'
});

schema.set('toObject', {
	getters  : true,
	virtuals : true
});


module.exports = mongoose.model('user', schema);
