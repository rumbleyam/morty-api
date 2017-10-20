export default (state = '0', action = {}) => {
	const map = {
		PORTFOLIO : '0',
		POST : '1',
		POST_FETCHED : '1',
		ABOUT : '2',
		CONTACT : '3'
	};

	const type = action.type;
	return map[type] || state;
};
