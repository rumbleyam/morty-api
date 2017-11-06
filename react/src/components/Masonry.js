import React from 'react';

class Masonry extends React.Component{
	constructor(props){
		super(props);
		this.state = {numberOfColumns: 1};
		this.onResize = this.onResize.bind(this);
	}

	componentDidMount(){
		this.onResize();
		if(window){
			window.addEventListener('resize', this.onResize);
		}
	}

	componentWillUnmount(){
		if(window){
			window.removeEventListener('resize', this.onResize);
		}
	}

	getNumberOfColumns(width){
		return this.props.breakPoints.reduceRight((previous, current, index) => {
			return current < width ? previous : index;
		}, this.props.breakPoints.length) + 1;
	}

	/**
	 * Adjust the layout of the columns when the screen is resized
	 * @return {void}
	 */
	onResize(){
		const numberOfColumns = this.getNumberOfColumns(this.refs.Masonry.offsetWidth);
		if(numberOfColumns !== this.state.numberOfColumns){
			this.setState({numberOfColumns: numberOfColumns});
		}
	}

	/**
	 * Assigns the provided children to columns
	 * @return {void}
	 */
	assignToColumns(){
		let columns = [];
		const numberOfColumns = this.state.numberOfColumns;
		for(let ii = 0; ii < numberOfColumns; ii++){
			columns.push([]);
		}
		return this.props.children.reduce((accumulator, value, index) => {
			accumulator[index%numberOfColumns].push(value);
			return accumulator;
		}, columns);
	}

	render(){
		return (
			<div className='masonry' ref='Masonry'>
				{this.assignToColumns().map((column, index) => {
					return (
						<div className='column' key={index} >
							{column.map((child, ii) => {
								return <div key={ii} style={{margin : 4}}>{child}</div>;
							})}
						</div>
					);
				})}
			</div>
		);
	}
}
export default Masonry;
