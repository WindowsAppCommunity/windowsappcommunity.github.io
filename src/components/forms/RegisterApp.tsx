import { Text, Stack, PrimaryButton, Checkbox, TextField, DefaultButton } from "office-ui-fabric-react";
import React from "react";
import { backendHost } from "../../common/const";
import { isLocalhost } from "../../common/helpers";
import { GetCurrentUser, IDiscordUser, discordAuthEndpoint } from "../../common/services/discord";

interface IProjectSubmission {
    appName?: string;
    description?: string;
    isPrivate?: boolean;

    launchId?: number;
    userId?: number;
};

export interface IRegisterAppProps {
    onCancel?: Function;
};

export const RegisterAppForm = (props: IRegisterAppProps) => {
    let [projectRequest, setProjectRequest] = React.useState<IProjectSubmission>({ isPrivate: false });
    let [submissionStatus, setSubmissionStatus] = React.useState<string>("");

    async function submitParticipantRequest() {
        let user: IDiscordUser | undefined = await GetCurrentUser();
        if (!user) {
            window.location.href = discordAuthEndpoint;
            return;
        };
        
        let url = `https://${backendHost}/projects?accessToken=${user.id}`;
        if (isLocalhost) {
            url = `http://${backendHost}/projects?accessToken=admin`;
        }

        if (projectRequest) {
            projectRequest.launchId = 2;
            projectRequest.userId = 1;
        }

        let request = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(projectRequest)
        });

        let json = await request.json();
        setSubmissionStatus(json);
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px" }}>
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

                <Text style={{ color: "red" }}>{submissionStatus}</Text>
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