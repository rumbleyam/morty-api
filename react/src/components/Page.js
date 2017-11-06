import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import MarkdownRenderer from './MarkdownRenderer';
import Paper from 'material-ui/Paper';
import {withStyles} from 'material-ui/styles';

const styles = (theme) => ({
	paper : theme.mixins.gutters({
		paddingTop : 16,
		paddingBottom : 16,
		marginTop : theme.spacing.unit * 3
	})
});

const Page = ({post, classes}) =>
	<div style={{paddingBottom : 16, paddingLeft : 16, paddingRight : 16}}>
		{post &&
			<Paper style={{maxWidth : '900px', margin : 'auto'}} classes={{root : classes.paper}}>
				<Typography type='headline' gutterBottom>
					{post.title}
				</Typography>
				<Typography type='subheading' gutterBottom>
					{post.description}
				</Typography>
				<MarkdownRenderer source={post.content}/>
			</Paper>
		}
	</div>
	;

const mapState = state => {
	return state.post || {};
};

export default connect(mapState)(withStyles(styles)(Page));
