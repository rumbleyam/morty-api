export default (state = {}, action = {}) => {
	if (action.type === 'BLOG_FETCHED'){
		const {blog} = action.payload;
		return {...state, blog};
	}

	return state;
};
