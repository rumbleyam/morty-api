import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import {withStyles} from 'material-ui/styles';
import MarkdownRenderer from './MarkdownRenderer';
import Paper from 'material-ui/Paper';

const styles = theme => ({
	root : theme.typography.body1,
	paper : theme.mixins.gutters({
		paddingTop : 16,
		paddingBottom : 16,
		marginTop : theme.spacing.unit * 3
	})
});

const Post = ({post, classes, style}) =>
	<div style={{paddingBottom : 16, paddingLeft : 16, paddingRight : 16}}>
		<Paper style={{maxWidth : '900px', margin : 'auto'}} classes={{root : classes.paper}}>
			<Typography type='headline'>
				{post.title}
			</Typography>
			<Typography type='body1' color='secondary'>
				{moment(post.createdAt).format('MMMM Do YYYY, h:mm a')}
			</Typography>
			{(post.createdAt != post.updatedAt) &&
				<Typography type='body1' color='secondary'>
					Updated {moment(post.updatedAt).format('MMMM Do YYYY, h:mm a')}
				</Typography>
			}
			<br/>
			<MarkdownRenderer source={post.content}/>
		</Paper>
	</div>;

const mapState = state => {
	return state.post || {};
};

export default connect(mapState)(withStyles(styles)(Post));
