import { Text, Stack, PrimaryButton, Checkbox, TextField, DefaultButton, IComboBoxOption, ComboBox } from "office-ui-fabric-react";
import React from "react";
import { PostProject } from "../../common/services/httpClient";
import { IBackendReponseError } from "../../common/interfaces";

interface IProjectSubmission {
    appName?: string;
    description?: string;
    isPrivate?: boolean;

    launchId?: number;
    categoryId?: number;

    roleId?: number;
    discordId?: string;
};

export interface IRegisterAppProps {
    onCancel?: Function;
    onSuccess: Function;
};

const roleOptions: IComboBoxOption[] = [
    { key: 1, text: 'Developer', selected:true },
    { key: 2, text: 'Tester' }
];

const categoryOptions: IComboBoxOption[] = [
    { key: 1, text: 'Other', selected:true }
];

export const RegisterAppForm = (props: IRegisterAppProps) => {
    let [projectRequest, setProjectRequest] = React.useState<IProjectSubmission>({ isPrivate: false });
    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function submitParticipantRequest() {
        if (projectRequest) {
            projectRequest.launchId = 2;
            if (projectRequest.categoryId === undefined) {
                projectRequest.categoryId = 1;
            }
            if (projectRequest.roleId === undefined) {
                projectRequest.roleId = 1;
            }
        }

        let request = await PostProject(projectRequest);

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
            <img style={{ display: (showSuccessIndicator ? "block" : "none"), height: "200px" }} src={showSuccessIndicator ? "/assets/img/checkanimated.svg" : ""} alt="Check"/>
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px", display: (!showSuccessIndicator ? "block" : "none") }}>
                <TextField label="App name:"
                    styles={{ root: { width: "100%" } }}
                    required onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, appName: value })} />

                <TextField label="Description"
                    styles={{ root: { width: "100%" } }}
                    multiline required autoAdjustHeight
                    placeholder="Enter a brief description of your project"
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, description: value })} />

                <Checkbox label="This project is private/secret"
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, isPrivate: value })} />

                <ComboBox
                    label="Role"
                    options={roleOptions}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, roleId: value.key})} />

                <ComboBox
                    label="Category"
                    options={categoryOptions}
                    onChange={(e: any, value: any) => setProjectRequest({ ...projectRequest, categoryId: value.key})} />

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