export default (state = {}, action = {}) => {
	if (action.type === 'POST_FETCHED'){
		const {post} = action.payload;
		return {...state, post};
	}

	return state;
};
