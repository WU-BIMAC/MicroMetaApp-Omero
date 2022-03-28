import MicroMetaAppReact from "micro-meta-app-react";
import DropdownMenu from "micro-meta-app-react/es/components/dropdownMenu";
import ModalWindow from "micro-meta-app-react/es/components/modalWindow";
import PopoverTooltip from "micro-meta-app-react/es/components/popoverTooltip";

import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import { render } from "react-dom";
import {
	isDefined,
	replaceLast,
} from "micro-meta-app-react/es/genericUtilities";

import {
	number_logo_width,
	number_logo_height,
	string_logo_img_micro_bk,
} from "micro-meta-app-react/es/constants";

const url = require("url");
class MicroMetaAppOmeroGroupChooser extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedLoadGroup: null,
			selectedSaveGroup: null,

			selectedProject: null,
			selectedDataset: null,
			selectedImage: null,

			inputImageID: null,
			inputImageIsValid: false,
		};

		//TODO this should probably be moved to propsUpdate method?
		if (isDefined(props.loadGroupID)) {
			for (const [key, value] of Object.entries(props.groups)) {
				if (value.id == props.loadGroupID) {
					this.state.selectedLoadGroup = key;
					break;
				}
			}
		}
		if (isDefined(props.saveGroupID)) {
			for (const [key, value] of Object.entries(props.groups)) {
				if (value.id == props.saveGroupID) {
					this.state.selectedSaveGroup = key;
					break;
				}
			}
		}

		this.onClickSelectLoadGroup = this.onClickSelectLoadGroup.bind(this);
		this.onClickSelectSaveGroup = this.onClickSelectSaveGroup.bind(this);
		this.onClickSelectProject = this.onClickSelectProject.bind(this);
		this.onClickSelectDataset = this.onClickSelectDataset.bind(this);
		this.onClickSelectImage = this.onClickSelectImage.bind(this);

		this.onClickConfirmGroup = this.onClickConfirmGroup.bind(this);
		this.onClickConfirmGroupImage = this.onClickConfirmGroupImage.bind(this);

		this.onChangeInputImageID = this.onChangeInputImageID.bind(this);
	}

	componentDidMount() {
		//TODO autoselect default group value?
	}

	onChangeInputImageID(input) {
		let newValueS = input.target.value;
		let newValue = Number(input.target.value);
		let groupNewKey = null;
		let projectNewKey = null;
		let datasetNewKey = null;
		let imageNewKey = null;
		let inputImageIsValid = false;
		for (const [groupKey, group] of Object.entries(this.props.groups)) {
			for (const [projectKey, project] of Object.entries(group.projects)) {
				for (const [datasetKey, dataset] of Object.entries(project.datasets)) {
					for (const [imageKey, image] of Object.entries(dataset.images)) {
						if (image.id === newValue) {
							groupNewKey = groupKey;
							projectNewKey = projectKey;
							datasetNewKey = datasetKey;
							imageNewKey = imageKey;
							inputImageIsValid = true;
							break;
						}
					}
					if (inputImageIsValid) break;
				}
				if (inputImageIsValid) break;
			}
			if (inputImageIsValid) break;
		}
		if (inputImageIsValid) {
			this.setState({
				selectedLoadGroup: groupNewKey,
				selectedProject: projectNewKey,
				selectedDataset: datasetNewKey,
				selectedImage: imageNewKey,
				inputImageID: newValueS,
				inputImageIsValid: inputImageIsValid,
			});
		} else {
			this.setState({
				selectedLoadGroup: null,
				selectedProject: null,
				selectedDataset: null,
				selectedImage: null,
				inputImageID: newValueS,
				inputImageIsValid: inputImageIsValid,
			});
		}
	}

	onClickSelectSaveGroup(item) {
		let itemKey = replaceLast(item, " - ", "_");
		this.setState({
			selectedSaveGroup: itemKey,
		});
	}

	onClickSelectLoadGroup(item) {
		let itemKey = replaceLast(item, " - ", "_");
		this.setState({
			selectedLoadGroup: itemKey,
			selectedProject: null,
			selectedDataset: null,
			selectedImage: null,
		});
	}

	onClickSelectProject(item) {
		let itemKey = replaceLast(item, " - ", "_");
		this.setState({
			selectedProject: itemKey,
			selectedDataset: null,
			selectedImage: null,
		});
	}

	onClickSelectDataset(item) {
		let itemKey = replaceLast(item, " - ", "_");
		this.setState({
			selectedDataset: itemKey,
			selectedImage: null,
		});
	}

	onClickSelectImage(item) {
		let itemKey = replaceLast(item, " - ", "_");
		console.log("item : " + item);
		console.log("itemKey : " + itemKey);
		let group = this.props.groups[this.state.selectedLoadGroup];
		let project = group.projects[this.state.selectedProject];
		let dataset = project.datasets[this.state.selectedDataset];
		let image = dataset.images[itemKey];
		let selectedImageID = image.id;
		this.setState({
			selectedImage: itemKey,
			inputImageID: selectedImageID,
			inputImageIsValid: true,
		});
	}

	onClickConfirmGroup() {
		let loadGroup = this.props.groups[this.state.selectedLoadGroup];
		let selectedLoadGroupID = loadGroup.id;
		let saveGroup = this.props.groups[this.state.selectedSaveGroup];
		let selectedSaveGroupID = saveGroup.id;
		this.props.onConfirm(selectedLoadGroupID, selectedSaveGroupID);
	}

	onClickConfirmGroupImage() {
		let group = this.props.groups[this.state.selectedLoadGroup];
		let selectedGroupID = group.id;
		let image =
			group.projects[this.state.selectedProject].datasets[
				this.state.selectedDataset
			].images[this.state.selectedImage];
		let selectedImageID = image.id;
		this.props.onConfirm(
			selectedGroupID,
			selectedImageID,
			this.state.selectedImage
		);
	}

	render() {
		let buttonStyle = {
			width: "200px",
			height: "50px",
			padding: "5px",
			margin: "5px",
		};
		let wrapperContainer = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "column",
			width: this.props.width,
			height: this.props.height,
			alignItems: "center",
		};
		const mainContainer = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "column",
			width: "100%",
			height: "100%",
			alignItems: "center",
		};
		const buttonsContainer0 = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "row",
			width: "100%",
			height: "120px",
			alignItems: "center",
			margin: "10px",
		};
		const buttonsContainer = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "row",
			width: "100%",
			height: "430px",
			alignItems: "center",
			margin: "10px",
		};
		let radioButtonsContainer0 = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "column",
			width: "360px",
			height: "120px",
			alignItems: "flex-start",
			maxHeight: "120px",
			overflow: "auto",
		};

		const radioButtonsContainer = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "column",
			width: "360px",
			height: "430px",
			alignItems: "flex-start",
			maxHeight: "430px",
			overflow: "auto",
		};

		const buttonStyleWide = {
			width: "350px",
			height: "50px",
			margin: "5px",
			whiteSpace: "break-spaces",
			wordBreak: "break-all",
			fontSize: "0.8em",
		};
		let buttonContainerStyle = {
			display: "flex",
			justifyContent: "center",
			flexFlow: "column",
			flexWrap: "wrap",
			alignItems: "center",
		};
		const logoContainer = {
			display: "flex",
			justifyContent: "flex-end",
			flexFlow: "column",
			width: "100%",
			//height: `${number_logo_height}px`,
			height: "40%",
			alignItems: "center",
		};
		let styleImage = {
			width: "100%",
			height: "100%",
			margin: "auto",
		};

		let styleImageContainer = {
			width: `${number_logo_width}px`,
			height: `${number_logo_height}px`,
		};

		let logoImg = url.resolve(
			this.props.imagesPathPNG,
			string_logo_img_micro_bk
		);
		let logoPath =
			logoImg +
			(logoImg.indexOf("githubusercontent.com") > -1 ? "?sanitize=true" : "");

		let groupsOnly = this.props.groupsOnly;
		let selectedLoadGroup = this.state.selectedLoadGroup;
		let selectedLoadGroupValue = this.state.selectedLoadGroup;
		if (isDefined(selectedLoadGroupValue))
			selectedLoadGroupValue = replaceLast(selectedLoadGroupValue, "_", " - ");
		let selectedSaveGroup = this.state.selectedSaveGroup;
		let selectedSaveGroupValue = this.state.selectedSaveGroup;
		if (isDefined(selectedSaveGroupValue))
			selectedSaveGroupValue = replaceLast(selectedSaveGroupValue, "_", " - ");
		let selectedProject = this.state.selectedProject;
		let selectedProjectValue = this.state.selectedProject;
		if (isDefined(selectedProjectValue))
			selectedProjectValue = replaceLast(selectedProjectValue, "_", " - ");
		let selectedDataset = this.state.selectedDataset;
		let selectedDatasetValue = this.state.selectedDataset;
		if (isDefined(selectedDatasetValue))
			selectedDatasetValue = replaceLast(selectedDatasetValue, "_", " - ");
		let selectedImage = this.state.selectedImage;
		let selectedImageValue = this.state.selectedImage;
		if (isDefined(selectedImageValue))
			selectedImageValue = replaceLast(selectedImageValue, "_", " - ");
		let inputImageID = this.state.inputImageID;
		let inputImageIsValid = this.state.inputImageIsValid;
		let continueDisabled = true;
		if (
			(groupsOnly &&
				isDefined(selectedLoadGroup) &&
				isDefined(selectedSaveGroup)) ||
			(!groupsOnly && isDefined(selectedImage))
		) {
			continueDisabled = false;
		}

		let groupNames = [];
		let projectNames = [];
		let datasetNames = [];
		let imageNames = [];
		let groups = this.props.groups;

		for (const [key, value] of Object.entries(groups)) {
			let newKey = replaceLast(key, "_", " - ");
			groupNames.push(newKey);
		}

		if (isDefined(selectedLoadGroup)) {
			let group = groups[selectedLoadGroup];
			for (const [key, value] of Object.entries(group.projects)) {
				let newKey = replaceLast(key, "_", " - ");
				projectNames.push(newKey);
			}
		}

		if (isDefined(selectedProject)) {
			let group = groups[selectedLoadGroup];
			let project = group.projects[selectedProject];
			for (const [key, value] of Object.entries(project.datasets)) {
				let newKey = replaceLast(key, "_", " - ");
				datasetNames.push(newKey);
			}
		}

		if (isDefined(selectedDataset)) {
			let group = groups[selectedLoadGroup];
			let project = group.projects[selectedProject];
			let dataset = project.datasets[selectedDataset];
			for (const [key, value] of Object.entries(dataset.images)) {
				let newKey = replaceLast(key, "_", " - ");
				imageNames.push(newKey);
			}
		}

		// 	TODO need to insert imageID selection somewhere here!
		//	TODO and need to handle it in setting loader new somehow
		// 	should not pass the whole group down but only image name so it comes preselected ?
		let titleText = null;
		let list_top = [];
		let list = [];
		if (!groupsOnly) {
			titleText = "Select the OMERO image you want to create settings for:";
			let groupLoadTooltip = {
				title: "Select group",
				content: (
					<p>
						Select the OMERO group that contains the image you want to create
						acquisition settings for.
					</p>
				),
				position: "bottom",
			};
			let projectTooltip = {
				title: "Select project",
				content: (
					<p>
						Select the OMERO project that contains the image you want to create
						acquisition settings for.
					</p>
				),
				position: "bottom",
			};
			let datasetTooltip = {
				title: "Select dataset",
				content: (
					<p>
						Select the OMERO dataset that contains the image you want to create
						acquisition settings for.
					</p>
				),
				position: "bottom",
			};
			let imageTooltip = {
				title: "Select image",
				content: (
					<p>
						Select the OMERO image you want to create acquisition settings for.
					</p>
				),
				position: "bottom",
			};

			let inputImageIDValue = "";
			if (isDefined(inputImageID)) {
				inputImageIDValue = inputImageID;
			}

			let inputImageIDForm = (
				<Form key="input-image-id">
					<Form.Group className="mb-3">
						<Form.Control
							size="lg"
							placeholder="Insert Image ID"
							value={inputImageIDValue}
							isInvalid={!inputImageIsValid}
							onChange={this.onChangeInputImageID}
						/>
					</Form.Group>
				</Form>
			);
			list_top.push(
				<div
					key="input-image-id-container"
					id="input-image-id-container"
					style={radioButtonsContainer0}
				>
					<h4 key={"input-image-id-title"}>Insert Image ID:</h4>
					{inputImageIDForm}
				</div>
			);

			let loadGroupRadios = [];
			for (let i = 0; i < groupNames.length; i++) {
				loadGroupRadios.push(
					<ToggleButton
						id={"load-group-radio-" + i}
						key={"load-group-radio-" + i}
						value={groupNames[i]}
						variant={"outline-primary"}
						style={buttonStyleWide}
					>
						{groupNames[i]}
					</ToggleButton>
				);
			}
			let loadGroupRadio = (
				<PopoverTooltip
					id={"popover-radio-load-group"}
					key={"popover-radio-load-group"}
					position={groupLoadTooltip.position}
					title={groupLoadTooltip.title}
					content={groupLoadTooltip.content}
					element={
						<ToggleButtonGroup
							id="radio-load-group"
							key="radio-load-group"
							type="radio"
							name="radio-load-group"
							value={selectedLoadGroupValue}
							onChange={(e) => {
								this.onClickSelectLoadGroup(e);
							}}
							vertical={true}
						>
							{loadGroupRadios}
						</ToggleButtonGroup>
					}
				/>
			);
			list.push(
				<div
					key="radio-load-group-container"
					id="radio-load-group-container"
					style={radioButtonsContainer}
				>
					<h4 key={"select-manufacturer"}>Load from group:</h4>
					{loadGroupRadio}
				</div>
			);

			if (isDefined(selectedLoadGroup)) {
				let loadProjectRadios = [];
				for (let i = 0; i < projectNames.length; i++) {
					loadProjectRadios.push(
						<ToggleButton
							id={"load-project-radio-" + i}
							key={"load-project-radio-" + i}
							value={projectNames[i]}
							variant={"outline-primary"}
							style={buttonStyleWide}
						>
							{projectNames[i]}
						</ToggleButton>
					);
				}
				let loadProjectRadio = (
					<PopoverTooltip
						id={"popover-radio-load-project"}
						key={"popover-radio-load-project"}
						position={projectTooltip.position}
						title={projectTooltip.title}
						content={projectTooltip.content}
						element={
							<ToggleButtonGroup
								id="radio-load-project"
								key="radio-load-project"
								type="radio"
								name="radio-load-project"
								value={selectedProjectValue}
								onChange={(e) => {
									this.onClickSelectProject(e);
								}}
								vertical={true}
							>
								{loadProjectRadios}
							</ToggleButtonGroup>
						}
					/>
				);
				list.push(
					<div
						key="radio-load-project-container"
						id="radio-load-project-container"
						style={radioButtonsContainer}
					>
						<h4 key={"select-project-title"}>Select Image Project:</h4>
						{loadProjectRadio}
					</div>
				);
				if (isDefined(selectedProject)) {
					let loadDatasetRadios = [];
					for (let i = 0; i < datasetNames.length; i++) {
						loadDatasetRadios.push(
							<ToggleButton
								id={"load-dataset-radio-" + i}
								key={"load-dataset-radio-" + i}
								value={datasetNames[i]}
								variant={"outline-primary"}
								style={buttonStyleWide}
							>
								{datasetNames[i]}
							</ToggleButton>
						);
					}
					let loadDatasetRadio = (
						<PopoverTooltip
							id={"popover-radio-load-dataset"}
							key={"popover-radio-load-dataset"}
							position={datasetTooltip.position}
							title={datasetTooltip.title}
							content={datasetTooltip.content}
							element={
								<ToggleButtonGroup
									id="radio-load-dataset"
									key="radio-load-dataset"
									type="radio"
									name="radio-load-dataset"
									value={selectedDatasetValue}
									onChange={(e) => {
										this.onClickSelectDataset(e);
									}}
									vertical={true}
								>
									{loadDatasetRadios}
								</ToggleButtonGroup>
							}
						/>
					);
					list.push(
						<div
							key="radio-load-dataset-container"
							id="radio-load-dataset-container"
							style={radioButtonsContainer}
						>
							<h4 key={"select-dataset-title"}>Select Image Dataset:</h4>
							{loadDatasetRadio}
						</div>
					);
					if (isDefined(selectedDataset)) {
						let loadImageRadios = [];
						for (let i = 0; i < imageNames.length; i++) {
							loadImageRadios.push(
								<ToggleButton
									id={"load-image-radio-" + i}
									key={"load-image-radio-" + i}
									value={imageNames[i]}
									variant={"outline-primary"}
									style={buttonStyleWide}
								>
									{imageNames[i]}
								</ToggleButton>
							);
						}
						let loadImageRadio = (
							<PopoverTooltip
								id={"popover-radio-load-image"}
								key={"popover-radio-load-image"}
								position={imageTooltip.position}
								title={imageTooltip.title}
								content={imageTooltip.content}
								element={
									<ToggleButtonGroup
										id="radio-load-image"
										key="radio-load-image"
										type="radio"
										name="radio-load-image"
										value={selectedImageValue}
										onChange={(e) => {
											this.onClickSelectImage(e);
										}}
										vertical={true}
									>
										{loadImageRadios}
									</ToggleButtonGroup>
								}
							/>
						);
						list.push(
							<div
								key="radio-load-image-container"
								id="radio-load-image-container"
								style={radioButtonsContainer}
							>
								<h4 key={"select-image-title"}>Select Image:</h4>
								{loadImageRadio}
							</div>
						);
					}
				}
			}
		} else {
			buttonsContainer0.height = "0px";
			radioButtonsContainer0.height = "0px";
			radioButtonsContainer0.maxHeight = "0px";
			titleText = "Select the OMERO groups you want to load from and save in:";
			let groupLoadTooltip = {
				title: "Select load group",
				content: (
					<p>Select the OMERO group you want to load your microscope from.</p>
				),
				position: "bottom",
			};
			let groupSaveTooltip = {
				title: "Select save group",
				content: (
					<p>Select the OMERO group you want to save your microscope in.</p>
				),
				position: "bottom",
			};
			let loadGroupRadios = [];
			for (let i = 0; i < groupNames.length; i++) {
				loadGroupRadios.push(
					<ToggleButton
						id={"rmo-radio-" + i}
						key={"rmo-radio-" + i}
						value={groupNames[i]}
						variant={"outline-primary"}
						style={buttonStyleWide}
					>
						{groupNames[i]}
					</ToggleButton>
				);
			}
			let loadGroupRadio = (
				<PopoverTooltip
					id={"popover-radio-load-group"}
					key={"popover-radio-load-group"}
					position={groupLoadTooltip.position}
					title={groupLoadTooltip.title}
					content={groupLoadTooltip.content}
					element={
						<ToggleButtonGroup
							id="radio-load-group"
							key="radio-load-group"
							type="radio"
							name="radio-load-group"
							value={selectedLoadGroupValue}
							onChange={(e) => {
								this.onClickSelectLoadGroup(e);
							}}
							vertical={true}
						>
							{loadGroupRadios}
						</ToggleButtonGroup>
					}
				/>
			);
			list.push(
				<div
					key="radio-load-group-container"
					id="radio-load-group-container"
					style={radioButtonsContainer}
				>
					<h4 key={"select-manufacturer"}>Load from group:</h4>
					{loadGroupRadio}
				</div>
			);
			let saveGroupRadios = [];
			for (let i = 0; i < groupNames.length; i++) {
				saveGroupRadios.push(
					<ToggleButton
						id={"save-group-radio-" + i}
						key={"save-group-radio-" + i}
						value={groupNames[i]}
						variant={"outline-primary"}
						style={buttonStyleWide}
					>
						{groupNames[i]}
					</ToggleButton>
				);
			}
			let saveGroupRadio = (
				<PopoverTooltip
					id={"popover-radio-save-group"}
					key={"popover-radio-save-group"}
					position={groupSaveTooltip.position}
					title={groupSaveTooltip.title}
					content={groupSaveTooltip.content}
					element={
						<ToggleButtonGroup
							id="radio-save-group"
							key="radio-save-group"
							type="radio"
							name="radio-save-group"
							value={selectedSaveGroupValue}
							onChange={(e) => {
								this.onClickSelectSaveGroup(e);
							}}
							vertical={true}
						>
							{saveGroupRadios}
						</ToggleButtonGroup>
					}
				/>
			);
			list.push(
				<div
					key="radio-save-group-container"
					id="radio-save-group-container"
					style={radioButtonsContainer}
				>
					<h4 key={"select-save-group"}>Save in group:</h4>
					{saveGroupRadio}
				</div>
			);
		}

		return (
			<div style={wrapperContainer}>
				<div style={mainContainer}>
					<div style={logoContainer}>
						<div style={styleImageContainer}>
							<img src={logoPath} alt={logoImg} style={styleImage} />
						</div>
					</div>
					<h4>{titleText}</h4>
					<div style={buttonsContainer0}>{list_top}</div>
					<div style={buttonsContainer}>{list}</div>
					<div style={buttonContainerStyle}>
						<OverlayTrigger
							placement={"right"}
							delay={{ show: 1000, hide: 1000 }}
							rootClose={true}
							rootCloseEvent={"mousedown" || "click"}
							overlay={
								<Popover id="popover-basic">
									<Popover.Title as="h3">Continue</Popover.Title>
									<Popover.Content>
										<p>Click Continue to use the current selections.</p>
									</Popover.Content>
								</Popover>
							}
						>
							<Button
								onClick={
									groupsOnly
										? this.onClickConfirmGroup
										: this.onClickConfirmGroupImage
								}
								style={buttonStyle}
								size="lg"
								disabled={continueDisabled}
							>
								Continue
							</Button>
						</OverlayTrigger>
					</div>
				</div>
			</div>
		);
	}
}
export default class MicroMetaAppOmero extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			groups: null,
			microscopeRepoID: props.microscopeRepoID || -1,
			settingRepoID: props.settingRepoID || -1,
			loadGroupRepoID: props.loadGroupID || -1,
			saveGroupRepoID: props.saveGroupID || -1,
			imageRepoID: props.imageID || -1,
			imageRepoName: props.imageName || null,
			microscope: null,
			saveMicroscopeComplete: null,

			mode: -1,
			waitForDataLoad: true,
		};

		this.overlaysContainerRef = React.createRef();

		this.onModeSelection = this.onModeSelection.bind(this);

		this.onListGroups = this.onListGroups.bind(this);
		this.onListGroupsProjectsDatasetsImages =
			this.onListGroupsProjectsDatasetsImages.bind(this);
		this.handleCompleteListGroups = this.handleCompleteListGroups.bind(this);

		this.onLoadMicroscopes = this.onLoadMicroscopes.bind(this);
		this.onLoadSettings = this.onLoadSettings.bind(this);

		this.onLoadMicroscope = this.onLoadMicroscope.bind(this);
		this.onLoadSetting = this.onLoadSetting.bind(this);

		this.onSaveMicroscope = this.onSaveMicroscope.bind(this);
		this.onSaveSetting = this.onSaveSetting.bind(this);

		this.onLoadMetadata = this.onLoadMetadata.bind(this);

		this.onGroupConfirm = this.onGroupConfirm.bind(this);
		this.onGroupImageConfirm = this.onGroupImageConfirm.bind(this);
	}

	componentDidMount() {
		//this.onListGroups();
		this.onListGroupsProjectsDatasetsImages();
	}

	onModeSelection(mode) {
		this.setState({
			mode: mode,
			loadGroupRepoID: -1,
			saveGroupRepoID: -1,
			imageRepoID: -1,
			imageRepoName: null,
			microscopeRepoID: -1,
			settingRepoID: -1,
			waitForDataLoad: true,
		});
	}

	onListGroupsProjectsDatasetsImages() {
		this.props.onListGroupsProjectsDatasetsImages(
			this.handleCompleteListGroups
		);
	}

	onListGroups() {
		this.props.onListGroups(this.handleCompleteListGroups);
	}

	handleCompleteListGroups(groups) {
		console.log("groups: ");
		console.log(groups);
		this.setState({ groups: groups });
	}

	onLoadMicroscopes(complete, resolve) {
		this.props.onLoadMicroscopes(this.state.loadGroupRepoID, complete, resolve);
	}

	onLoadSettings(complete, resolve) {
		this.props.onLoadSettings(this.state.loadGroupRepoID, complete, resolve);
	}

	onLoadMicroscope(microscopeID) {
		console.log("microscopeID: " + microscopeID);
		this.setState({ microscopeRepoID: microscopeID });
	}

	onLoadSetting(settingID) {
		console.log("settingID: " + settingID);
		this.setState({ settingRepoID: settingID });
	}

	onSaveMicroscope(microscope, complete) {
		this.props.onSaveMicroscope(
			this.state.saveGroupRepoID,
			microscope,
			complete
		);
	}

	onSaveSetting(setting, complete) {
		this.props.onSaveSetting(
			this.state.microscopeRepoID,
			this.state.loadGroupRepoID,
			this.state.imageRepoID,
			setting,
			complete
		);
	}

	onGroupConfirm(loadGroupRepoID, saveGroupRepoID) {
		console.log("loadGroupRepoID: " + loadGroupRepoID);
		console.log("sveGroupRepoID: " + saveGroupRepoID);
		this.setState({
			loadGroupRepoID: loadGroupRepoID,
			saveGroupRepoID: saveGroupRepoID,
			waitForDataLoad: false,
		});
	}

	onGroupImageConfirm(groupRepoID, imageRepoID, imageRepoName) {
		console.log("groupRepoID: " + groupRepoID);
		console.log("imageRepoID: " + imageRepoID);
		console.log("imageRepoName: " + imageRepoName);
		this.setState({
			loadGroupRepoID: groupRepoID,
			imageRepoID: imageRepoID,
			imageRepoName: imageRepoName,
			waitForDataLoad: false,
		});
	}

	onLoadMetadata(complete) {
		this.props.onLoadMetadata(
			this.state.loadGroupRepoID,
			this.state.imageRepoID,
			complete
		);
	}

	render() {
		let width = this.props.width;
		let height = this.props.height;
		let groups = this.state.groups;
		let loadGroupRepoID = this.state.loadGroupRepoID;
		let saveGroupRepoID = this.state.saveGroupRepoID;
		let imageRepoID = this.state.imageRepoID;
		let mode = this.state.mode;
		let imageName = this.state.imageRepoName;
		let waitForDataLoad = this.state.waitForDataLoad;
		if (isDefined(imageName)) {
			imageName = replaceLast(imageName, " - ", "_");
		}

		if (!isDefined(groups)) {
			return "";
		}

		let modalWindow = null;
		// if (!isDefined(groupRepoID) || groupRepoID === -1) {
		// 	// modalWindow = (
		// 	// <ModalWindow
		// 	// 	overlaysContainer={this.overlaysContainerRef.current}
		// 	// ></ModalWindow>;
		// 	// );

		// 	return (
		// 		<MicroMetaAppOmeroGroupChooser
		// 			width={"100%"}
		// 			height={"100%"}
		// 			imagesPathPNG={this.props.imagesPathPNG}
		// 			groups={this.state.groups}
		// 			groupsOnly={true}
		// 			onConfirm={this.onGroupConfirm}
		// 		/>
		// 	);
		// }
		if (
			mode === 1 &&
			(!isDefined(loadGroupRepoID) || loadGroupRepoID === -1) &&
			(!isDefined(saveGroupRepoID) || saveGroupRepoID === -1)
		) {
			modalWindow = (
				<ModalWindow overlaysContainer={this.overlaysContainerRef.current}>
					<MicroMetaAppOmeroGroupChooser
						width={"100%"}
						height={"100%"}
						imagesPathPNG={this.props.imagesPathPNG}
						groups={this.state.groups}
						groupsOnly={true}
						onConfirm={this.onGroupConfirm}
					/>
				</ModalWindow>
			);
		} else if (
			mode === 2 &&
			(!isDefined(loadGroupRepoID) || loadGroupRepoID === -1) &&
			(!isDefined(imageRepoID) || imageRepoID === -1)
		) {
			modalWindow = (
				<ModalWindow overlaysContainer={this.overlaysContainerRef.current}>
					<MicroMetaAppOmeroGroupChooser
						width={"100%"}
						height={"100%"}
						imagesPathPNG={this.props.imagesPathPNG}
						groups={this.state.groups}
						groupsOnly={false}
						onConfirm={this.onGroupImageConfirm}
					/>
				</ModalWindow>
			);
		}
		return (
			<MicroMetaAppOmeroContainer
				width={width}
				height={height}
				forwardedRef={this.overlaysContainerRef}
			>
				{modalWindow}
				<MicroMetaAppReact
					width={width}
					height={height}
					onLoadSchema={this.props.onLoadSchema}
					onLoadDimensions={this.props.onLoadDimensions}
					onLoadTierList={this.props.onLoadTierList}
					onLoadMicroscopes={this.onLoadMicroscopes}
					onModeSelection={this.onModeSelection}
					onLoadMicroscope={this.onLoadMicroscope}
					onLoadSetting={this.onLoadSetting}
					onSaveMicroscope={this.onSaveMicroscope}
					onLoadSettings={this.onLoadSettings}
					onSaveSetting={this.onSaveSetting}
					onLoadMetadata={this.onLoadMetadata}
					imageName={imageName}
					imagesPathPNG={this.props.imagesPathPNG}
					imagesPathSVG={this.props.imagesPathSVG}
					hasSettings={true}
					waitForDataLoad={waitForDataLoad}
				/>
			</MicroMetaAppOmeroContainer>
		);
	}
}

class MicroMetaAppOmeroContainer extends React.PureComponent {
	render() {
		// const wrapperContainer = {
		// 	display: "flex",
		// 	justifyContent: "center",
		// 	flexFlow: "column",
		// 	width: "100%",
		// 	height: "100%",
		// 	alignItems: "center",
		// };
		var { height, width, forwardedRef } = this.props;
		var style = { height, width, boxSizing: "border-box" };
		// border-box allows element to account for padding and border
		// when calculating/using `height` and `width` style properties.
		return (
			<div id="microscopy-app-omero-container" style={style}>
				{this.props.children}
				<div id="microscopy-app-omero-overlays-container" ref={forwardedRef} />
			</div>
		);
	}
}
