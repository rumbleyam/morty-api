import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import {withStyles} from 'material-ui/styles';
import MarkdownRenderer from './MarkdownRenderer';

const styles = theme => ({
	root: theme.typography.body1
});

const Post = ({post, classes, style}) =>
	<div>
		<Typography type='headline' gutterBottom>
			{post.title}
		</Typography>
		<Typography gutterBottom>
			{post.description}<br/>
			{moment(post.createdAt).format('MM/DD/YY')}
		</Typography>

		<MarkdownRenderer source={post.content}/>
	</div>;

const mapState = state => {
	return state.post || {};
};

export default connect(mapState)(withStyles(styles)(Post));
