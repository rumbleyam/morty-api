/**
 * Manages display of the About page.
 */
import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';

const About = () =>
	<div>
		<Typography type='title' gutterBottom>
			About
		</Typography>
		<Typography type='subheading' gutterBottom>
			Coming Soon
		</Typography>
		<Typography type='body1' gutterBottom>
			Check back later!
		</Typography>
	</div>;

const mapState = state => state.about || {};

export default connect(mapState)(About);
