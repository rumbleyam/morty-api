import React from 'react';
import {connect} from 'react-redux';
import {TransitionGroup, Transition} from 'transition-group';
import UniversalComponent from './UniversalComponent';

import styles from '../css/Switcher';

const Switcher = ({page, direction}) =>{
	return <TransitionGroup
		className = {`${styles.switcher} ${direction}`}
	>
		<Transition key={page}>
			<UniversalComponent page={page} />
		</Transition>
	</TransitionGroup>;
};


const mapState = ({page, direction, ...state}) => ({
	page,
	direction
});

export default connect(mapState)(Switcher);
