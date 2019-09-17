import { Text, Stack, PrimaryButton, Checkbox, TextField, Icon } from "office-ui-fabric-react";
import React from "react";
import HoverBox from "../../components/HoverBox";
import { backendHost } from "../../common/const";

interface IProjectSubmission {
    appName?: string;
    name?: string;
    description?: string;
    isPrivate?: boolean;
    email?: string;
    discordId?: string;
};

export const RegisterApp = () => {
    let [projectRequest, setProjectRequest] = React.useState<IProjectSubmission>({ isPrivate: false });
    let [submissionStatus, setSubmissionStatus] = React.useState<string>("");

    async function submitParticipantRequest() {
        let request = await fetch(`https://${backendHost}/projects?token=${projectRequest.discordId}&`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(projectRequest)
        });

        let json = await request.json();
        setSubmissionStatus(json);
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack horizontal wrap horizontalAlign="center" tokens={{ childrenGap: 25 }}>
                <HoverBox style={{ padding: "20px" }}>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                        <Stack horizontal tokens={{childrenGap: 10}}>
                            <Icon style={{ fontSize: 28 }} iconName="AppIconDefaultAdd" />
                            <Text variant="xLarge">Register an app</Text>
                        </Stack>
                        <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ width: "300px" }}>
                            <TextField label="Developer name:" description="Friendly name that users will see" styles={{ root: { width: "100%" } }} required onChange={(e, value) => setProjectRequest({ ...projectRequest, name: value })} />

                            <TextField label="App name:" styles={{ root: { width: "100%" } }} required onChange={(e, value) => setProjectRequest({ ...projectRequest, appName: value })} />

                            <TextField label="Description" styles={{ root: { width: "100%" } }} multiline required autoAdjustHeight placeholder="Enter a brief description of your project" onChange={(e, value) => setProjectRequest({ ...projectRequest, description: value })} />

                            <TextField label="Contact email:" description="Optional" styles={{ root: { width: "100%" } }} onChange={(e, value) => setProjectRequest({ ...projectRequest, email: value })} />

                            <Checkbox label="This project is private/secret" onChange={(e, value) => setProjectRequest({ ...projectRequest, isPrivate: value })} />

                            <Text style={{ color: "red" }}>{submissionStatus}</Text>
                            <PrimaryButton text="Register" onClick={submitParticipantRequest} />
                        </Stack>
                    </Stack>
                </HoverBox>
            </Stack>
        </Stack>
    )
};