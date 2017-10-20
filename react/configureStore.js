import createHistory from 'history/createMemoryHistory';
import { NOT_FOUND } from 'redux-first-router';
import configureStore from './src/configureStore';

export default async function (req, res) {
	// TODO: Handle tokens
	const token = {};
	const preLoadedState = {token};
	const history = createHistory({initialEntries: [req.path()]});
	const {store, thunk} = configureStore(history, preLoadedState);

	let location = store.getState().location;
	if (doesRedirect(location, res)){
		return false;
	}

	await thunk(store);

	location = store.getState().location;
	if (doesRedirect(location, res)){
		return false;
	}

	const status = location.type === NOT_FOUND ? 404 : 200;
	res.status(status);
	return store;
}

const doesRedirect = ({kind, pathname}, res) => {
	if (kind === 'redirect') {
		res.redirect(302, pathname);
		return true;
	}
};
