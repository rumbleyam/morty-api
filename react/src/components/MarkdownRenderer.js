/**
 * MarkdownRenderer
 * Renders Markdown using react-markdown and custom components
 * @type {React.Component}
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {monoBlue} from 'react-syntax-highlighter/dist/styles';
import {withStyles, withTheme} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

/**
 * Styles to apply to the renderer
 * @param  {Object} theme Material-UI theme
 * @return {void}
 */
const styles = theme => ({
	root: theme.typography.body1
});

/**
 * Code, for displaying inline code
 * @param {String} literal Literal representation of code to display
 * @param {Object} theme   Material-UI Theme object
 */
const Code = withTheme(({literal, theme}) => {
	return <SyntaxHighlighter
		customStyle={{
			display : 'initial',
			padding : '4px',
			color : theme.palette.primary['800']
		}}
		PreTag='span'
	>
		{literal}
	</SyntaxHighlighter>;
});

/**
 * CodeBlock, for displaying a block of code
 * @param {String} literal  Literal representation of code to display
 * @param {String} language Which language to use for code highlighting
 * @param {Object} theme    Material-UI Theme object
 */
const CodeBlock = withTheme(({literal, language, theme}) => {
	return <Paper>
		<SyntaxHighlighter
			showLineNumbers={true}
			language={language}
			style={monoBlue}>
			{literal}
		</SyntaxHighlighter>
	</Paper>;
});

/**
 * Map of heading values to their corresponding Typography type
 * Intended to represent <h1/> through <h6/>
 * @type {Object}
 */
const HeadingTypes = {
	1 : 'title',
	2 : 'subheading',
	3 : 'body2',
	4 : 'body2',
	5 : 'body2',
	6 : 'body2'
};

/**
 * Heading, for dispaying headers 1 through 6
 * @param {Object} children Child components to wrap with Typography
 * @param {Number} level    The level of heading to display, 1 through 6.
 */
const Heading = ({children, level}) => {
	return <Typography
		type={HeadingTypes[level]}>
		{children}
	</Typography>;
};

/**
 * ThematicBreak, for displaying a horizontal rule
 */
const ThematicBreak = () => {
	return <hr
		style={{
			borderTop   : '3px solid #E1E1E1',
			marginTop   : '8px',
			borderLeft  : 0
		}}
	/>;
};

/**
 * Renderer, for rendering Markdown
 */
const Renderer = withStyles(styles)(({source, classes}) =>
	<ReactMarkdown source={source} className={classes.root} renderers = {{
		Code          : Code,
		CodeBlock     : CodeBlock,
		Heading       : Heading,
		Paragraph     : Typography,
		ThematicBreak : ThematicBreak
	}}/>
);

export default Renderer;
