import { Text, Stack, PrimaryButton, TextField } from "office-ui-fabric-react";
import React from "react";
import HoverBox from "../../components/HoverBox";
import { backendHost } from "../../common/const";

interface IUserSubmission {
    name?: string;
    email?: string;
    discordId?: string;
};

export const RegisterUser = () => {
    let [myRequest, setMyRequest] = React.useState<IUserSubmission>({});
    let [submissionStatus, setSubmissionStatus] = React.useState<string>("");

    async function submitParticipantRequest() {
        let url = `https://${backendHost}/user?accessToken=${myRequest.discordId}`;
        if(backendHost === "localhost:5000"){
            url = `http://${backendHost}/user?accessToken=admin`;
        }

        let request = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(myRequest)
        });

        let json = await request.json();
        setSubmissionStatus(json);
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack horizontal wrap horizontalAlign="center" tokens={{ childrenGap: 25 }}>
                <HoverBox style={{ padding: "20px" }}>
                    <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px" }}>
                        <TextField label="Developer name:"
                            description="Friendly name that users will see"
                            styles={{ root: { width: "100%" } }}
                            required
                            onChange={(e, value) => setMyRequest({ ...myRequest, name: value })} />

                        <TextField label="Contact email:"
                            description="Optional"
                            styles={{ root: { width: "100%" } }}
                            onChange={(e, value) => setMyRequest({ ...myRequest, email: value })} />

                        <TextField label="Discord Id:"
                            styles={{ root: { width: "100%" } }}
                            onChange={(e, value) => setMyRequest({ ...myRequest, discordId: value })} />

                        <Text style={{ color: "red" }}>{submissionStatus}</Text>
                        <PrimaryButton text="Register" onClick={submitParticipantRequest} />
                    </Stack>
                </HoverBox>
            </Stack>
        </Stack>
    )
};