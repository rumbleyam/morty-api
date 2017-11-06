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
	Blog : universal(() => import('./Blog'), {
		minDelay : 0,
		loading
	}),
	Page : universal(() => import('./Page'), {
		minDelay : 0,
		loading
	}),
	Showcase : universal(() => import('./Showcase'), {
		minDelay : 0,
		loading
	}),
	Post : universal(() => import('./Post'), {
		minDelay : 0,
		loading
	}),
	NotFound
};
