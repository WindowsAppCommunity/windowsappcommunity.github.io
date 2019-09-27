import { Text, Stack, PrimaryButton, Checkbox, TextField, DefaultButton, IComboBoxOption, ComboBox } from "office-ui-fabric-react";
import React from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateProject, ICreateProjectsRequestBody } from "../../common/services/projects";

export interface IRegisterAppProps {
    onCancel?: Function;
    onSuccess: Function;
};

const roleOptions: IComboBoxOption[] = [
    { key: 1, text: 'Developer', selected: true },
    { key: 2, text: 'Beta tester' },
    { key: 3, text: 'Translator' },
    { key: 4, text: 'Other' }
];

const categoryOptions: IComboBoxOption[] = [
    { key: 1, text: 'Other', selected: true }
];

export const RegisterAppForm = (props: IRegisterAppProps) => {
    let [projectRequest, setProjectRequest] = React.useState<ICreateProjectsRequestBody>({
        isPrivate: false, awaitingLaunchApproval: false, role: "Other"
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function submitParticipantRequest() {

        let request = await CreateProject(projectRequest as ICreateProjectsRequestBody);

        let success = await request.status === 200;

        if (!success) {
            let error: IBackendReponseError = await request.json();
            if (error.error && error.reason) {
                setSubmissionError(error.reason);
            }
        } else {
            setShowSuccessIndicator(true);
            setTimeout(() => {
                props.onSuccess();
            }, 2500);
        }
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            {/* Need to toggle both src and display so it trigger the animation, and space is taken up during the transition (while the svg loads) */}
            <img style={{ display: (showSuccessIndicator ? "block" : "none"), height: "200px" }} src={showSuccessIndicator ? "/assets/img/checkanimated.svg" : ""} alt="Check" />
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px", display: (!showSuccessIndicator ? "block" : "none") }}>
                <TextField label="App name:"
                    styles={{ root: { width: "100%" } }}
                    required onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, appName: value })} />

                <TextField label="Description"
                    styles={{ root: { width: "100%" } }}
                    multiline required autoAdjustHeight
                    placeholder="Enter a brief description of your project"
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, description: value })} />

                <Checkbox label="Project is private"
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, isPrivate: value })} />

                <TextField label="Download Link:"
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, downloadLink: value })} />

                <TextField label="Github Link:"
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, githubLink: value })} />

                <TextField label="External link"
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, externalLink: value })} />

                <ComboBox
                    label="Your role"
                    options={roleOptions}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, role: value.text })} />

                <ComboBox
                    label="Category" hidden
                    options={categoryOptions}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, category: value.text })} />


                <Checkbox label="Partipation in Launch 2020"
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, awaitingLaunchApproval: value })} />

                <Text style={{ display: projectRequest.awaitingLaunchApproval ? "block" : "none" }}>You will receive a notification once your app is approved for Launch 2020</Text>

                <Text style={{ color: "red" }}>{submissionError}</Text>
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <PrimaryButton text="Register" onClick={submitParticipantRequest} />
                    {
                        props.onCancel ?
                            <DefaultButton text="Cancel" onClick={() => props.onCancel ? props.onCancel() : undefined} />
                            : ""
                    }
                </Stack>
            </Stack>
        </Stack>
    )
};