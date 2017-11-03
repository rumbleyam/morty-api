import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import MarkdownRenderer from './MarkdownRenderer';

const Page = ({post}) =>
	<div>
		<Typography type='headline' gutterBottom>
			{post.title}
		</Typography>
		<Typography type='subheading' gutterBottom>
			{post.description}
		</Typography>
		<MarkdownRenderer source={post.content}/>
	</div>;

const mapState = state => {
	return state.post || {};
};

export default connect(mapState)(Page);
