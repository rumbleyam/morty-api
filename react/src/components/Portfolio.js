/**
 * Manages display of the Portfolio page.
 */
import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';

const Portfolio = () =>
	<div>
		<Typography type='title' gutterBottom>
			Portfolio
		</Typography>
		<Typography type='subheading' gutterBottom>
			Coming Soon
		</Typography>
		<Typography type='body1' gutterBottom>
			Check back later!
		</Typography>
	</div>;

const mapState = state => state.portfolio || {};

export default connect(mapState)(Portfolio);
