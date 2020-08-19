import MicroscopyMetadataTool from "4dn-microscopy-metadata-tool";

export default class MicroscopyMetadataToolOmero extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	//onLoadMicroscopes={props.onLoadMicroscopes}
	//onSaveMicroscope = { props.onWorkingDirectorySave }
	render() {
		return (
			<MicroscopyMetadataTool
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
