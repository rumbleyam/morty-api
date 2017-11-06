import React from 'react';

import Switcher from './Switcher';

import {withTheme, withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Tabs, {Tab} from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';

import {connect} from 'react-redux';
import {goToPage} from '../actions';

const styleSheet = (theme => ({
	root: {
		flexGrow: 1,
		marginTop: theme.spacing.unit * 3,
	}
}));

const tabMap = {
	0 : {
		page : 'SHOWCASE'
	},
	1 : {
		page : 'BLOG'
	},
	2 : {
		page : 'ABOUT'
	},
	3 : {
		page : 'CONTACT'
	}
};

const tabToSelect = {
	posts : 1
};

const customStyles = (theme) => ({
	header : {
		color : 'white'
	},
	paper : theme.mixins.gutters({
		paddingTop : 16,
		marginTop : theme.spacing.unit * 3
	}),
	appBar : {
		marginBottom : 16
	}
});

const App = ({navigate, path, theme, classes, selectedTab}) => {
	return (
		<div style={{backgroundColor : theme.palette.secondary['50'], minHeight: '100%'}}>
			<AppBar position='static' classes={{root : classes.appBar}}>
				<Typography type='headline' gutterBottom align='center' classes={{root : classes.header}}>andrew.rumbley.io</Typography>
				<div style={{backgroundColor : theme.palette.primary['800']}}>
					<Tabs
						value = {selectedTab}
						onChange={(event, index) => navigate(tabMap[index].page, tabMap[index].id)}
						textColor='white'
						indicatorColor='accent'
						centered
					>
						<Tab label='Showcase' />
						<Tab label='Blog' />
						<Tab label='About' />
						<Tab label='Contact' />
					</Tabs>
				</div>
			</AppBar>
			<Switcher />
		</div>
	);
};

const mapDispatch = {navigate: goToPage};
const mapState = ({location, selectedTab}) => {
	return {path: location.pathname, selectedTab};
};

export default connect(mapState, mapDispatch)(withTheme(withStyles(customStyles)(App)));
