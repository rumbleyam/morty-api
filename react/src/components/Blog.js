import React from 'react';
import {connect} from 'react-redux';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import PostList from './PostList';

const Blog = ({blog}) =>
	<div style={{paddingLeft : 16, paddingRight : 16}}>
		<PostList posts={blog}/>
	</div>;

const mapState = state => {
	return state.blog || {};
};

export default connect(mapState)(Blog);
