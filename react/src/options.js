import {redirect} from 'redux-first-router';
import {isAllowed, isServer} from './utils';

export default {
	onBeforeChange: (dispatch, getState, action) => {
		const allowed = isAllowed(action.type, getState());

		if (!allowed) {
			const action = redirect({type: 'LOGIN'});
			dispatch(action);
		}
	},
	onAfterChange: (dispatch, getState) => {
		const { type } = getState().location;

		if (type === 'LOGIN' && !isServer) {

		}
	}
};
