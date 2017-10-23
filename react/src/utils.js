import routesMap from './routesMap';
import config from './config.json';

export const isServer = typeof window === 'undefined';

export const fetchData = async (path, token) => {
	let options = {
		headers : {
			Accept : 'application/json'
		}
	};
	if(token){
		options.headers.Authorization = token;
	}
	return fetch(`${config.apiURL}${path}`, options).then(data => data.json());
};

/**
 * TODO: Implement this
 * @param  {[type]}  type  [description]
 * @param  {[type]}  state [description]
 * @return {Boolean}       [description]
 */
export const isAllowed = (type, state) => {
	return true;
};
