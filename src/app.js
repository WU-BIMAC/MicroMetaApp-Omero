import MicroMetaAppReact from "micro-meta-app-react";

export default class MicroMetaAppOmero extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	//onLoadMicroscopes={props.onLoadMicroscopes}
	//onSaveMicroscope = { props.onWorkingDirectorySave }
	render() {
		return (
			<MicroMetaAppReact
				width={this.props.width}
				height={this.props.height}
				onLoadSchema={this.props.onLoadSchema}
				onLoadDimensions={this.props.onLoadDimensions}
				onLoadMicroscopes={this.props.onLoadMicroscopes}
				onSaveMicroscope={this.props.onSaveMicroscope}
				imagesPathPNG={this.props.imagesPathPNG}
				imagesPathSVG={this.props.imagesPathSVG}
			/>
		);
	}
}
