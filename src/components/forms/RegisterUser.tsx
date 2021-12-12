import { Text, Stack, PrimaryButton, TextField, DefaultButton } from "office-ui-fabric-react";
import React from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateUser, IUser, ModifyUser } from "../../common/services/users";
import { CurrentUser } from "../../common/services/discord";

export interface IRegisterDevProps {
    onCancel?: Function;
    onSuccess: (user: IUser) => void;
    userData?: IUser;
    modifying?: boolean;
};

export const RegisterUserForm = (props: IRegisterDevProps) => {
    let [userRequest, setUserRequest] = React.useState<IUser>(props.userData ? props.userData : {
        discordId: CurrentUser.id,
        name: ""
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function addUser() {
        if (!userRequest) return;

        let request = props.modifying ? await ModifyUser(userRequest)
            : await CreateUser(userRequest);

        let success = request.status === 200;

        if (!success) {
            let error: IBackendReponseError = await request.json();
            if (error.error && error.reason) {
                setSubmissionError(error.reason);
            }
        } else {
            setShowSuccessIndicator(true);
            setTimeout(() => {
                props.onSuccess(userRequest);
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
                        onChange={(e: any, value: any) => setUserRequest({ ...userRequest, name: value })} />

                    <TextField label="Contact email:"
                        description="Optional. An email where users or devs can reach you."
                        defaultValue={props.userData ? props.userData.email : ""}
                        styles={{ root: { width: "100%" } }}
                        onChange={(e: any, value: any) => setUserRequest({ ...userRequest, email: value })} />

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