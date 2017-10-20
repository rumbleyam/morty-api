import {NOT_FOUND} from 'redux-first-router';

export default (state = 'PORTFOLIO', action = {}) => {
	return components[action.type] || state;
};

const components = {
	ABOUT: 'About',
	PORTFOLIO: 'Portfolio',
	CONTACT : 'Contact',
	POST: 'Post',
	[NOT_FOUND]: 'NotFound'
};
