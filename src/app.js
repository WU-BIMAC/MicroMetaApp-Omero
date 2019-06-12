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
				onLoadMicroscopes={this.props.onLoadMicroscopes}
				imagesPath={this.props.imagesPath}
			/>
		);
	}
}
