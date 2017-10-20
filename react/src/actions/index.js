import {NOT_FOUND} from 'redux-first-router';

export const goToPage = (type, id) => {
	switch(type){
	case 'POST':
		return {
			type,
			payload : {postId : id}
		};
	default:
		return {
			type,
			payload: id && {category : id}
		};
	}
};

export const goToPost = (postId) => ({
	type : 'POST',
	payload : {postId}
});

export const notFound = () => ({
	type : NOT_FOUND
});
