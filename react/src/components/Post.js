import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';

const Post = ({post}) =>
	<div>
		<Typography type='title' gutterBottom>
			{post.title}
		</Typography>
		<Typography type='subheading' gutterBottom>
			{post.description}<br/>
			{moment(post.createdAt).format('MM/DD/YY')}
		</Typography>
		<Typography type='body1' gutterBottom>
			{post.content}
		</Typography>

		<pre>
			{JSON.stringify(post, null, 4)}
		</pre>
	</div>;

const mapState = state => state.post || {};

export default connect(mapState)(Post);
