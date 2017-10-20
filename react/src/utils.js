import routesMap from './routesMap';
import config from './config.json';

export const isServer = typeof window === 'undefined';

export const fetchData = async (path, token) =>
fetch(`${config.apiURL}${path}`, {
	headers: {
		Accept: 'application/json',
		Authorization: token
	}
}).then(data => data.json());

/**
 * TODO: Implement this
 * @param  {[type]}  type  [description]
 * @param  {[type]}  state [description]
 * @return {Boolean}       [description]
 */
export const isAllowed = (type, state) => {
	return true;
};
