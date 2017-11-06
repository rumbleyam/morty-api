import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile } from 'material-ui/GridList';
import Card, { CardActions, CardContent, CardMedia, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import moment from 'moment';
import Masonry from './Masonry';
import Link from 'redux-first-router-link';

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden'
	},
	gridList: {
		maxWidth : 900
	},
	subheader: {
		width: '100%',
	},
	card: {
		minWidth : 300
	},
	media: {
		height: 200,
	},
	avatar: {
		backgroundColor : theme.palette.primary['500']
	}
});

const masonryOptions = {
	transitionDuration: 0
};

const PostList = ({posts, classes}) =>
	<div className={classes.root} style={{maxWidth : 900, margin : 'auto'}}>
		<Masonry
			breakPoints = {[616]}
		>
			{posts.map(post => (
				<Card className={classes.card}>
					<CardHeader
						title={post.title}
						subheader={moment(post.createdAt).format('MMMM Do YYYY, h:mm a')}
					/>
					<CardContent>
						<Typography component='p'>
							{post.description}
						</Typography>
					</CardContent>
					<CardActions>
						<Link to={`/posts/${post.id}`} style={{color : 'inherit', textDecoration: 'inherit'}}>
							<Button dense color='primary'>
							View
							</Button>
						</Link>
					</CardActions>
				</Card>
			))}
		</Masonry>
	</div>;

export default withStyles(styles)(PostList);
