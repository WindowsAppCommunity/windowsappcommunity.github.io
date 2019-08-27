import { Text, Stack, PrimaryButton, Checkbox, TextField, BaseButton, Button } from "office-ui-fabric-react";
import React from "react";
import { GetUserAvatar, GetCurrentUser, IDiscordUser, AuthData, IsUserInServer } from "../../common/discordService";
import HoverBox from "../../components/HoverBox";

interface IParticipantRequest {
    appName?: string;
    author?: string;
    description?: string;
    isPrivate?: boolean;
    contact?: IParticipantContact
};
interface IParticipantContact {
    email?: string;
    discord?: string;
};

export const Register = () => {
    let [participantRequest, setParticipantRequest] = React.useState<IParticipantRequest>({});
    let [submissionStatus, setSubmissionStatus] = React.useState<string>("");

    async function setDiscordInfo() {
        let user: IDiscordUser | undefined = await GetCurrentUser();
        if (!user) throw new Error("User not logged in");

        setParticipantRequest({ ...participantRequest, author: user.username, contact: { ...participantRequest.contact, discord: user.username } })
    }

    async function submitParticipantRequest() {
        console.log(participantRequest);
        let request = await fetch("https://uwpcommunity-site-backend.herokuapp.com/launch/participants/submit", {
            method: "POST",
            body: JSON.stringify(participantRequest)
        });

        let json = await request.json();
        setSubmissionStatus(json);
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <p style={{ fontFamily: "Segoe UI, Sans-Serif", fontWeight: "lighter", fontSize: "24px", margin: 0 }}>Register an app for Launch 2020</p>

            <Stack horizontal wrap horizontalAlign="center" tokens={{ childrenGap: 25 }}>
                <HoverBox style={{ padding: "20px" }}>
                    <Stack horizontalAlign="center" tokens={{ childrenGap: 5 }}>
                        <Text variant="xLarge">Register</Text>
                        <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ width: "300px" }}>
                            <TextField label="Developer name:" description="Friendly name that users will see" styles={{ root: { width: "100%" } }} required onChange={(e, value) => setParticipantRequest({ ...participantRequest, appName: value })} />

                            <TextField label="App name:" styles={{ root: { width: "100%" } }} required onChange={(e, value) => setParticipantRequest({ ...participantRequest, appName: value })} />

                            <TextField label="Description" styles={{ root: { width: "100%" } }} multiline required autoAdjustHeight placeholder="Enter a brief description of your project" onChange={(e, value) => setParticipantRequest({ ...participantRequest, description: value })} />

                            <TextField label="Contact email:" description="Optional" styles={{ root: { width: "100%" } }} onChange={(e, value) => setParticipantRequest({ ...participantRequest, contact: {...participantRequest.contact, email: value} })} />

                            <Checkbox label="This project is private/secret" onChange={(e, value) => setParticipantRequest({ ...participantRequest, isPrivate: value })} />

                            <Text style={{color: "red"}}>{submissionStatus}</Text>
                            <PrimaryButton text="Register" onClick={submitParticipantRequest} />
                        </Stack>
                    </Stack>
                </HoverBox>
            </Stack>
        </Stack>
    )
};