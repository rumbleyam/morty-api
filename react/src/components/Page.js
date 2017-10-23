import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';

const Page = ({post}) =>
	<div>
		<Typography type='title' gutterBottom>
			{post.title}
		</Typography>
		<Typography type='subheading' gutterBottom>
			{post.description}
		</Typography>
		<Typography type='body1' gutterBottom>
			{post.content}
		</Typography>
	</div>;

const mapState = state => {
	return state.post || {};
};

export default connect(mapState)(Page);
