import { Text, Stack, PrimaryButton, Checkbox, TextField, DefaultButton, IComboBoxOption, ComboBox, MaskedTextField, Pivot, PivotItem, IComboBox } from "office-ui-fabric-react";
import React, { FormEvent } from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateProject, ICreateProjectsRequestBody, IProject, ModifyProject, IModifyProjectsRequestBody, GetProjectsByDiscordId } from "../../common/services/projects";
import { MicrosoftStoreAppCategories } from "../../common/const";

export interface IEditProjectDetailsFormProps {
    onCancel?: Function;
    onSuccess: (updatedProject?: IProject) => void;
    projectData: Partial<IProject>;
    editing?: boolean;
};

const roleOptions: IComboBoxOption[] = [
    { key: 1, text: 'Developer', selected: true },
    { key: 2, text: 'Beta tester' },
    { key: 3, text: 'Translator' },
    { key: 4, text: 'Other' }
];

const categoryOptions: IComboBoxOption[] = MicrosoftStoreAppCategories.map((category, index) => {
    return { key: category, text: category }
});

export const EditProjectDetailsForm = (props: IEditProjectDetailsFormProps) => {
    let [projectRequest, setProjectRequest] = React.useState<Partial<ICreateProjectsRequestBody>>({
        isPrivate: false, awaitingLaunchApproval: false, role: "Developer", ...props.projectData
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function submitParticipantRequest() {
        let request;
        if (props.editing) {
            if (!props.projectData.appName) {
                throw new Error("Unable to modify project details. Missing app name prop");
            }
            request = await ModifyProject(projectRequest as IModifyProjectsRequestBody, { appName: props.projectData.appName });
        } else {
            request = await CreateProject(projectRequest as ICreateProjectsRequestBody);
        }

        let success = request.status === 200;

        if (!success) {
            let error: IBackendReponseError = await request.json();
            if (error.error && error.reason) {
                setSubmissionError(error.reason);
            }
        } else {
            setShowSuccessIndicator(true);
            setTimeout(() => {
                // TODO. Make a new request to get new project details, the below only is only a temporary solution
                props.onSuccess(projectRequest as IProject);
            }, 2500);
        }
    }

    return (
        <Stack horizontalAlign="center">
            {/* Need to toggle both src and display so it trigger the animation, and space is taken up during the transition (while the svg loads) */}
            <img style={{ display: (showSuccessIndicator ? "block" : "none"), height: "200px" }} src={showSuccessIndicator ? "/assets/img/checkanimated.svg" : ""} alt="Check" />
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px", display: (!showSuccessIndicator ? "block" : "none") }}>
                <Pivot>
                    <PivotItem headerText="Basic info">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField label="Project name:" maxLength={50}
                                styles={{ root: { width: "100%" } }}
                                value={projectRequest.appName}
                                required onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, appName: value })} />

                            <TextField label="Description" maxLength={140}
                                styles={{ root: { width: "100%" } }}
                                multiline required autoAdjustHeight
                                value={projectRequest.description}
                                placeholder="Enter a brief description"
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, description: value })} />

                            <TextField label="Hero image"
                                type="url"
                                styles={{ root: { width: "100%" } }}
                                required
                                value={projectRequest.heroImage}
                                placeholder="External link to an image of your app"
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, heroImage: value })} />
                        </Stack>
                    </PivotItem>
                    <PivotItem headerText="Project links">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField label="Download Link:"
                                value={projectRequest.downloadLink}
                                disabled={!props.editing && props.projectData.downloadLink !== undefined}
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, downloadLink: value })} />

                            <TextField label="Github Link:"
                                value={projectRequest.githubLink}
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, githubLink: value })} />

                            <TextField label="External link"
                                value={projectRequest.externalLink}
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, externalLink: value })} />

                        </Stack>
                    </PivotItem>
                    <PivotItem headerText="More info">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <ComboBox
                                label="Category"
                                options={categoryOptions}
                                defaultSelectedKey={projectRequest.category || categoryOptions[0].key}
                                onChange={(e: FormEvent<IComboBox>, option: IComboBoxOption | undefined) => {
                                    if (!option) return;
                                    setProjectRequest({ ...projectRequest, category: option.text });
                                }} />

                            <Checkbox label="Project is private/secret"
                                checked={projectRequest.isPrivate}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, isPrivate: value })} />

                            <Checkbox label="Partipation in Launch 2020"
                                checked={projectRequest.awaitingLaunchApproval}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, awaitingLaunchApproval: value })} />

                            <Text style={{ display: projectRequest.awaitingLaunchApproval ? "block" : "none" }}>A moderator will contact you over Discord to help with the manual review process for Launch 2020</Text>
                        </Stack>
                    </PivotItem>
                </Pivot>

                <Text style={{ color: "red" }}>{submissionError}</Text>
                <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-evenly" style={{ marginTop: 20 }}>
                    {
                        props.onCancel ?
                            <DefaultButton text="Cancel" onClick={() => props.onCancel ? props.onCancel() : undefined} />
                            : ""
                    }
                    <PrimaryButton text={props.editing ? "Update" : "Register"} onClick={submitParticipantRequest} />
                </Stack>
            </Stack>
        </Stack>
    )
};