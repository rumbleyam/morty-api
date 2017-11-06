export default (state = {}, action = {}) => {
	if (action.type === 'POST_FETCHED'
	|| action.type === 'ABOUT_FETCHED'
	|| action.type === 'CONTACT_FETCHED'
	|| action.type === 'SHOWCASE_FETCHED'){
		const {post} = action.payload;
		return {...state, post};
	}

	return state;
};
