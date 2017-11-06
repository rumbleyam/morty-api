export default (state = 'Showcase', action = {}) => {
	const map = {
		ABOUT : 'About',
		BLOG : 'Blog',
		CONTACT : 'Contact',
		SHOWCASE : 'Showcase',
		POST : 'Post'
	};

	console.log(action);

	if (action.type === 'POST_FETCHED'
	|| action.type === 'ABOUT_FETCHED'
	|| action.type === 'CONTACT_FETCHED'
	|| action.type === 'SHOWCASE_FETCHED'){
		console.log('fetch!');
		return action.payload.post.title;
	} else{
		console.log('no fetch :(');
	}

	const type = action.type;
	return map[type] || state;
};
