import { Text, Stack, PrimaryButton, TextField, DefaultButton } from "@fluentui/react";
import React from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateUser, ModifyUser } from "../../common/services/users";
import { CurrentUser } from "../../common/services/discord";
import { IUser } from "../../interface/IUser";
import { IDiscordConnection, IEmailConnection, IUserConnection } from "../../interface/IUserConnection";

export interface IRegisterDevProps {
    onCancel?: Function;
    onSuccess: (user: IUser) => void;
    userData?: IUser;
    modifying?: boolean;
};

export const RegisterUserForm = (props: IRegisterDevProps) => {
    let [userState, setState] = React.useState<IUser>(props.userData ? props.userData : {
        name: "",
        markdownAboutMe: "",
        connections: [
            { connectionName: "discord", discordId: CurrentUser.id } as IDiscordConnection,
        ],
        links: [],
        projects: [],
        publishers: [],
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function addUser() {
        if (!userState) return;

        let request = props.modifying ? await ModifyUser(userState)
            : await CreateUser(userState);

        let success = request.status === 200;

        if (!success) {
            let error: IBackendReponseError = await request.json();
            if (error.error && error.reason) {
                setSubmissionError(error.reason);
            }
        } else {
            setShowSuccessIndicator(true);
            setTimeout(() => {
                props.onSuccess(userState);
            }, 2500);
        }
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            {/* Need to toggle both src and display so it trigger the animation, and space is taken up during the transition (while the svg loads) */}
            <img style={{ display: (showSuccessIndicator ? "block" : "none"), height: "200px" }} src={showSuccessIndicator ? "/assets/img/checkanimated.svg" : ""} alt="Check" />
            <Stack horizontalAlign="start" tokens={{ childrenGap: 7 }} style={{ maxWidth: "100%", width: "300px", display: (!showSuccessIndicator ? "block" : "none") }}>
                <Stack>
                    <TextField label="Name:"
                        description="Friendly name for other users/devs to see"
                        defaultValue={props.userData ? props.userData.name : ""}
                        styles={{ root: { width: "100%" } }}
                        required
                        onChange={(e: any, value: any) => setState({ ...userState, name: value })} />

                    <TextField label="Contact email:"
                        description="Optional. An email where users or devs can reach you."
                        defaultValue={props.userData ? (props.userData.connections.find(x => (x as IEmailConnection)) as IEmailConnection)?.email : ""}
                        styles={{ root: { width: "100%" } }}
                        onChange={(e: any, value: any) => {
                            var target = userState.connections?.find(x => x.connectionName = "email") as IEmailConnection;
                            if (!target) {
                                target = { email: value as string, connectionName: "email" } as IEmailConnection;
                                userState.connections?.push(target)
                            }
                            else {
                                target.email = value as string;
                            }

                            setState({ ...userState });
                        }} />

                    <Text variant="small" style={{ marginTop: 10, marginBottom: 10 }}>When you leave the Discord server, any data or projects you register with us will be removed automatically.</Text>

                    <Text style={{ color: "red" }}>{submissionError}</Text>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <PrimaryButton text={props.modifying ? "Update" : "Register"}
                        onClick={addUser} />
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


