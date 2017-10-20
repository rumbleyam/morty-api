import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';
import {connectRoutes} from 'redux-first-router';

import routesMap from './routesMap';
import options from './options';
import * as reducers from './reducers';
import * as actionCreators from './actions';

export default (history, preLoadedState) => {
	const {reducer, middleware, enhancer, thunk} = connectRoutes(
		history,
		routesMap,
		options
	);

	const rootReducer = combineReducers({...reducers, location: reducer});
	const middlewares = applyMiddleware(middleware);
	const enhancers = composeEnhancers(enhancer, middlewares);
	const store = createStore(rootReducer, preLoadedState, enhancers);

	return {store, thunk};
};

const composeEnhancers = (...args) =>
typeof window !== 'undefined'
? composeWithDevTools({ actionCreators })(...args)
: compose(...args);
