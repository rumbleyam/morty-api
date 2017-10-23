import {NOT_FOUND} from 'redux-first-router';

export default (state = 'PORTFOLIO', action = {}) => {
	console.log(action.type);
	console.log(components[action.type]);
	return components[action.type] || state;
};

const components = {
	ABOUT_FETCHED   : 'Page',
	PORTFOLIO       : 'Portfolio',
	CONTACT_FETCHED : 'Page',
	POST_FETCHED    : 'Post',
	[NOT_FOUND]     : 'NotFound'
};
