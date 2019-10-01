import { Text, Stack, PrimaryButton, Checkbox, TextField, DefaultButton, IComboBoxOption, ComboBox, MaskedTextField, Pivot, PivotItem } from "office-ui-fabric-react";
import React from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateProject, ICreateProjectsRequestBody } from "../../common/services/projects";
import { MicrosoftStoreAppCategories } from "../../common/const";

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

const categoryOptions: IComboBoxOption[] = MicrosoftStoreAppCategories.map((category, index) => {
    return { key: index, text: category, selected: index == 0 }
});

export const RegisterAppForm = (props: IRegisterAppProps) => {
    let [projectRequest, setProjectRequest] = React.useState<Partial<ICreateProjectsRequestBody>>({
        isPrivate: false, awaitingLaunchApproval: false, role: "Developer"
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function submitParticipantRequest() {
        let request = await CreateProject(projectRequest as ICreateProjectsRequestBody);

        let success = request.status === 200;

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
        <Stack horizontalAlign="center">
            {/* Need to toggle both src and display so it trigger the animation, and space is taken up during the transition (while the svg loads) */}
            <img style={{ display: (showSuccessIndicator ? "block" : "none"), height: "200px" }} src={showSuccessIndicator ? "/assets/img/checkanimated.svg" : ""} alt="Check" />
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px", display: (!showSuccessIndicator ? "block" : "none") }}>
                <Pivot>
                    <PivotItem headerText="Basic info">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField label="Project name:" maxLength={50}
                                styles={{ root: { width: "100%" } }}
                                required onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, appName: value })} />

                            <TextField label="Description" maxLength={140}
                                styles={{ root: { width: "100%" } }}
                                multiline required autoAdjustHeight
                                placeholder="Enter a brief description"
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, description: value })} />

                            <TextField label="Hero image"
                                type="url"
                                styles={{ root: { width: "100%" } }}
                                required
                                placeholder="External link to an image of your app"
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, externalLink: value })} />
                        </Stack>
                    </PivotItem>
                    <PivotItem headerText="Project links">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <MaskedTextField label="Download Link:"
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, downloadLink: value })} />

                            <MaskedTextField label="Github Link:"
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, githubLink: value })} />

                            <MaskedTextField label="External link"
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, externalLink: value })} />

                        </Stack>
                    </PivotItem>
                    <PivotItem headerText="More info">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <ComboBox
                                label="Category"
                                options={categoryOptions}
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, category: value.text })} />

                            <Checkbox label="Project is private/secret"
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, isPrivate: value })} />

                            <Checkbox label="Partipation in Launch 2020"
                                onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, awaitingLaunchApproval: value })} />

                            <Text style={{ display: projectRequest.awaitingLaunchApproval ? "block" : "none" }}>You will receive a notification once your app is manually approved</Text>
                        </Stack>
                    </PivotItem>
                </Pivot>

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