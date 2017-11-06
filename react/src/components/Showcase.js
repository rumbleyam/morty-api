/**
 * Manages display of the Showcase page.
 */
import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';

const Showcase = () =>
	<div>
		<Typography type='title' gutterBottom>
			Showcase
		</Typography>
		<Typography type='subheading' gutterBottom>
			Coming Soon
		</Typography>
		<Typography type='body1' gutterBottom>
			Check back later!
		</Typography>
	</div>;

const mapState = state => state.showcase || {};

export default connect(mapState)(Showcase);
