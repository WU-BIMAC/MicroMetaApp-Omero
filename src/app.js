import MicroscopeMetadataTool from "4dn-microscopy-metadata-tool";

class MicroscopeMetadataToolOmero extends React.PureComponent {
	//onLoadMicroscopes={props.onLoadMicroscopes}
	//onSaveMicroscope = { props.onWorkingDirectorySave }
	render() {
		<MicroscopeMetadataTool
			width={props.dims.width}
			height={props.dims.height}
			onLoadSchema={props.onLoadSchema}
		/>;
	}
}
