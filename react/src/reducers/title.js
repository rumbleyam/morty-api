export default (state = 'Portfolio', action = {}) => {
	const map = {
		ABOUT : 'About',
		CONTACT : 'Contact',
		PORTFOLIO : 'Portfolio',
		POST : 'Post'
	};

	const type = action.type;
	return map[type] || state;
};
