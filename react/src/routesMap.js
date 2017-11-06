/**
 * Map of all supported routes
 * @type {String}
 */

import {redirect, NOT_FOUND} from 'redux-first-router';
import {fetchData} from './utils';

export default {
	POST: {
		path : '/posts/:postId',
		thunk : async(dispatch, getState) => {
			const {
				jwToken,
				location : {payload : {postId}}
			} = getState();

			const post = await fetchData(`/api/posts/${postId}`);

			if(!post) {
				return dispatch({type: NOT_FOUND});
			}

			dispatch({type : 'POST_FETCHED', payload : {post}});
		}
	},
	BLOG: {
		path : '/blog',
		thunk : async(dispatch, getState) => {
			const {
				jwToken
			} = getState();

			const blog = await fetchData('/api/posts?template=article');

			if(!blog) {
				return dispatch({type: NOT_FOUND});
			}

			dispatch({type : 'BLOG_FETCHED', payload : {blog}});
		}
	},
	ABOUT: {
		path : '/about',
		thunk : async(dispatch, getState) => {
			const {
				jwToken
			} = getState();

			const post = await fetchData('/api/posts/about');

			if(!post) {
				return dispatch({type: NOT_FOUND});
			}

			dispatch({type : 'ABOUT_FETCHED', payload : {post}});
		}
	},
	CONTACT: {
		path : '/contact',
		thunk : async(dispatch, getState) => {
			const {
				jwToken
			} = getState();

			const post = await fetchData('/api/posts/contact');

			if(!post) {
				return dispatch({type: NOT_FOUND});
			}

			dispatch({type : 'CONTACT_FETCHED', payload : {post}});
		}
	},
	SHOWCASE : {
		path : '/',
		thunk : async(dispatch, getState) => {
			const {
				jwToken
			} = getState();

			const post = await fetchData('/api/posts/showcase');

			if(!post) {
				return dispatch({type: NOT_FOUND});
			}

			dispatch({type : 'SHOWCASE_FETCHED', payload : {post}});
		}
	}
};
