import { Text, Stack, PrimaryButton, TextField, DefaultButton } from "office-ui-fabric-react";
import React from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateUser, IUser, ModifyUser } from "../../common/services/users";
import { CurrentUser } from "../../common/services/discord";

export interface IRegisterDevProps {
    onCancel?: Function;
    onSuccess: Function;
    userData?: Partial<IUser>;
};

export const RegisterUserForm = (props: IRegisterDevProps) => {
    let [userRequest, setUserRequest] = React.useState<IUser>({
        discordId: CurrentUser.id,
        name: "Username"
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    /* Todo: Attempt to find an existing user in the DB and set this according, then prepopulate the fields below */
    let [modifying] = React.useState(false);

    async function addUser() {
        if (!userRequest) return;

        let request = modifying ? await ModifyUser(userRequest)
            : await CreateUser(userRequest);

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
                <TextField label="Name:"
                    description="Friendly name for other users/devs to see"
                    value={props.userData ? props.userData.name : ""}
                    styles={{ root: { width: "100%" } }}
                    required
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, name: value })} />

                <TextField label="Contact email:"
                    description="Optional"
                    value={props.userData ? props.userData.email : ""}
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, email: value })} />

                <Text style={{ color: "red" }}>{submissionError}</Text>
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <PrimaryButton text="Register"
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