import {NOT_FOUND} from 'redux-first-router';

export default (state = 'SHOWCASE', action = {}) => {
	return components[action.type] || state;
};

const components = {
	ABOUT_FETCHED    : 'Page',
	SHOWCASE_FETCHED : 'Page',
	CONTACT_FETCHED  : 'Page',
	POST_FETCHED     : 'Post',
	BLOG_FETCHED     : 'Blog',
	[NOT_FOUND]      : 'NotFound'
};
