import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import App from './components/App';
import configureStore from './configureStore';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import createPalette from 'material-ui/styles';
import {deepPurple, indigo} from 'material-ui/colors';

const history = createHistory();
const {store} = configureStore(history, window.REDUX_STATE);

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: deepPurple,
		secondary: indigo,
		type: 'light'
	}
});

class Main extends React.Component {
	// Remove the server-side injected CSS
	componentDidMount(){
		const jssStyles = document.getElementById('jss-server-side');
		if(jssStyles && jssStyles.parentNode){
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}

	render(){
		return <App {...this.props} />;
	}
}

const render = App => {
	const root = document.getElementById('root');
	ReactDOM.render(
		<AppContainer>
			<MuiThemeProvider theme={theme}>
				<Provider store={store}>
					<Main />
				</Provider>
			</MuiThemeProvider>
		</AppContainer>,
		root
	);
};

render(App);
