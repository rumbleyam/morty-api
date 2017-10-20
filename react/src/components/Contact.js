/**
 * Manages display of the Contact page.
 */
import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';

const Contact = () =>
	<div>
		<Typography type='title' gutterBottom>
			Contact
		</Typography>
		<Typography type='subheading' gutterBottom>
			Coming Soon
		</Typography>
		<Typography type='body1' gutterBottom>
			Check back later!
		</Typography>
	</div>;

const mapState = state => state.contact || {};

export default connect(mapState)(Contact);
