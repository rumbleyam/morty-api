/**
 * Manages displaying pages
 */
import React from 'react';
import universal from 'react-universal-component';
import {spinner, notFound } from '../css/Switcher';

const loading = () => <div><div /></div>;
const NotFound = () => <div>PAGE NOT FOUND - 404</div>;

export default ({page, isLoading}) => {
	const Component = components[page] || NotFound;
	return <Component isLoading={isLoading} />;
};

const components = {
	About : universal(() => import('./About'), {
		minDelay : 0,
		loading
	}),
	Contact : universal(() => import('./Contact'), {
		minDelay : 0,
		loading
	}),
	Portfolio : universal(() => import('./Portfolio'), {
		minDelay : 0,
		loading
	}),
	Post : universal(() => import('./Post'), {
		minDelay : 0,
		loading
	}),
	NotFound
};
