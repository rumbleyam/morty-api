import {NOT_FOUND} from 'redux-first-router';

export default (state = 'PORTFOLIO', action = {}) => {
	return components[action.type] || state;
};

const components = {
	ABOUT_FETCHED   : 'Page',
	PORTFOLIO       : 'Portfolio',
	CONTACT_FETCHED : 'Page',
	POST_FETCHED    : 'Post',
	[NOT_FOUND]     : 'NotFound'
};
