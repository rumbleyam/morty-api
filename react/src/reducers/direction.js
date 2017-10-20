export default (state = 'next', action = {}) => {
	if(!action.meta || !action.meta.location){
		return state;
	}

	const type = action.type;
	const prevType = action.meta.location.prev.type;

	if(type === prevType){
		return state;
	}
	if(type === 'POST'){
		return 'back';
	} else {
		return 'next';
	}
};
