import { EditProjectDetailsForm, IEditProjectDetailsFormProps } from './EditProjectDetailsForm';
import React from "react";
import { IProject } from '../../common/services/projects';
import { Stack, Text, PrimaryButton, DefaultButton, TooltipHost, DirectionalHint, Link, TeachingBubble, TextField, FontIcon } from 'office-ui-fabric-react';
import { fetchBackend } from '../../common/helpers';

export interface ICreateProjectFormProps extends IEditProjectDetailsFormProps {

};

export const CreateProjectForm = (props: ICreateProjectFormProps) => {
    const [verified, setVerified] = React.useState(false);
    const [codeVerificationDisplayed, setCodeVerificationDisplayed] = React.useState(false);
    const [manualReviewMessageShown, setManualReviewMessageShown] = React.useState(true);
    const [projectData, setProjectData] = React.useState<Partial<IProject>>({});

    return (
        codeVerificationDisplayed ? <ProjectCodeVerifier onCancel={() => { setCodeVerificationDisplayed(false) }} onSuccess={(projectDetails) => {
            setProjectData(projectDetails);

            setCodeVerificationDisplayed(false);
            setVerified(true);
            setManualReviewMessageShown(false);
        }} />
            :
            verified ?
                (manualReviewMessageShown ?
                    <Stack tokens={{ childrenGap: 10 }}>
                        <Text>Manual review is required after submitting your project. This could take anywhere from several hours to several days</Text>
                        <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-evenly" style={{ marginTop: 20 }}>
                            <DefaultButton onClick={() => {
                                setManualReviewMessageShown(false);
                                setVerified(false);
                            }}>Go back</DefaultButton>
                            <PrimaryButton onClick={() => setManualReviewMessageShown(false)}>Continue</PrimaryButton>
                        </Stack>
                    </Stack>
                    : <EditProjectDetailsForm {...props} projectData={projectData} />)
                :
                <Stack tokens={{ childrenGap: 10, padding: 5 }}>
                    <Text variant="large">Before we begin...</Text>
                    <Stack horizontal tokens={{ childrenGap: 5 }}>
                        <FontIcon iconName="ReceiptCheck" style={{ fontSize: 25 }} />
                        <Text variant="medium">Is your app public and already in the store?</Text>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 5 }}>
                        <FontIcon iconName="ReceiptCheck" style={{ fontSize: 25 }} />
                        <Text variant="medium">Do you have a "Publisher support" email listed on your apps' MS Store page?</Text>
                    </Stack>
                    <Stack style={{ marginTop: 20 }} horizontal tokens={{ childrenGap: 15 }} horizontalAlign="space-evenly">
                        <DefaultButton onClick={() => { setProjectData({ ...props.projectData, ...projectData }); setVerified(true) }}>No</DefaultButton>
                        <PrimaryButton onClick={() => { setProjectData({ ...props.projectData, ...projectData }); setCodeVerificationDisplayed(true) }}>Yes</PrimaryButton>
                    </Stack>
                </Stack>
    );
};

interface IProjectCodeVerifierProps {
    onSuccess: (projectDetails: Partial<IProject>) => void;
    onCancel: Function;
    projectData?: Partial<IProject>;
}
export const ProjectCodeVerifier = (props: IProjectCodeVerifierProps) => {
    enum VerficationState {
        "PreInit", "WaitingForCode", "Verified"
    }

    const [storeIdTeachingBubbleTarget, setStoreIdTeachingBubbleTarget] = React.useState<MouseEvent>();
    const [storeId, setStoreId] = React.useState<string>();
    const [verificationCodeText, setVerificationCodeText] = React.useState<string>();
    const [verificationState, setVerificationState] = React.useState<VerficationState>(VerficationState.PreInit);
    const [errorMessage, setErrorMessage] = React.useState("");

    async function BeginVerification() {
        if (!validateStoreIdField()) return;
        const request = await fetchBackend("projects/verification", "POST", {
            storeId: storeId
        });

        if (request.status === 200) {
            setVerificationState(VerficationState.WaitingForCode);
        } else {
            const response = await request.json();
            console.error(response);
            setErrorMessage(response.reason);
        }
    }

    async function checkVerification() {
        if (!validateStoreIdField()) return;
        const request = await fetchBackend(`projects/verification?storeId=${storeId}&code=${verificationCodeText}`, "GET");

        if (request.status === 200) {
            setVerificationState(VerficationState.Verified);
        } else {
            const response = await request.json();
            console.error(response);
            setErrorMessage(response.reason);
        }
    }

    function validateStoreIdField() {
        if (!storeId || storeId.length < 12) {
            setErrorMessage("Store ID is too short");
            return false;
        }
        setErrorMessage("");
        return true;
    }

    const hideStoreIdTeachingBubbleTimeout = {
        tick: setTimeout(() => { }, 0),
        onTimeout: () => {
            setStoreIdTeachingBubbleTarget(undefined);
        },
        init: () => {
            hideStoreIdTeachingBubbleTimeout.clear();
            hideStoreIdTeachingBubbleTimeout.cleared = false;
            hideStoreIdTeachingBubbleTimeout.tick = setTimeout(hideStoreIdTeachingBubbleTimeout.onTimeout, 1000);
        },
        cleared: false,
        clear: () => {
            hideStoreIdTeachingBubbleTimeout.cleared = true;
            clearTimeout(hideStoreIdTeachingBubbleTimeout.tick);
        }
    };

    function showStoreIdTeachingButton(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        hideStoreIdTeachingBubbleTimeout.clear();
        setStoreIdTeachingBubbleTarget(event.nativeEvent);
    }

    function hideStoreIdTeachingButton(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        hideStoreIdTeachingBubbleTimeout.init();
    }

    function onStoreIDTextFieldKeyPress(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (event.key == "Enter") {
            BeginVerification();
        }
    }

    function onVerificationCodeTextFieldKeyPress(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (event.key == "Enter") {
            checkVerification();
        }
    }

    return (
        <Stack>
            {
                (() => {
                    switch (verificationState.valueOf()) {
                        case VerficationState.PreInit:
                            return <>
                                {storeIdTeachingBubbleTarget !== undefined ?
                                    <TeachingBubble calloutProps={{ directionalHintFixed: true, directionalHint: DirectionalHint.topAutoEdge }} target={storeIdTeachingBubbleTarget}>
                                        <Stack onMouseLeave={hideStoreIdTeachingButton} onMouseOver={() => hideStoreIdTeachingBubbleTimeout.clear()} tokens={{ childrenGap: 10 }}>
                                            <Text variant="mediumPlus">This is the alphanumeric 12 character ID assigned to your app. It can be found in the URL for your app's store listing</Text>
                                            <Text variant="small"><DefaultButton target="_blank" href="https://docs.microsoft.com/en-us/windows/uwp/publish/view-app-identity-details#link-to-your-apps-listing">More details</DefaultButton></Text>
                                        </Stack>
                                    </TeachingBubble>
                                    : <></>}

                                <Stack tokens={{ childrenGap: 13 }}>
                                    <Text>Your project can be verified automatically, and will be immediately visible to the community</Text>
                                    <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 10 }}>
                                        <Text variant="mediumPlus">Enter the Store ID for your app</Text>
                                        <Text variant="small" style={{ color: "gray" }} onMouseLeave={hideStoreIdTeachingButton} ><Link onClick={showStoreIdTeachingButton}>What's this?</Link></Text>
                                    </Stack>
                                    <Stack grow horizontal tokens={{ childrenGap: 5 }}>
                                        <TextField onKeyPress={onStoreIDTextFieldKeyPress} styles={{ field: { width: 250 } }} placeholder="9p75w183m6qr" onChange={(e: any, value: any) => setStoreId(value)} />
                                        <PrimaryButton onClick={() => BeginVerification()} style={{ minWidth: 25 }} iconProps={{ iconName: "Forward" }} />
                                    </Stack>
                                </Stack>
                            </>;
                        case VerficationState.WaitingForCode:
                            return <Stack tokens={{ childrenGap: 10 }}>
                                <Stack grow horizontal tokens={{ childrenGap: 5 }} verticalAlign="end">
                                    <FontIcon iconName="InboxCheck" style={{ fontSize: 24 }} />
                                    <Text variant="xLarge">Check your inbox / junk mail</Text>
                                </Stack>
                                <Text variant="mediumPlus">Enter the code we sent you</Text>
                                <Stack grow horizontal tokens={{ childrenGap: 5 }}>
                                    <TextField onChange={(e: any, value: any) => setVerificationCodeText(value)} onKeyPress={onVerificationCodeTextFieldKeyPress} styles={{ field: { width: 250 } }} />
                                    <PrimaryButton onClick={() => checkVerification()} style={{ minWidth: 25 }} iconProps={{ iconName: "Forward" }} />
                                </Stack>
                            </Stack>;
                        case VerficationState.Verified:
                            return <Stack horizontalAlign="center" tokens={{ childrenGap: 15, padding: 10 }}>
                                <FontIcon style={{ fontSize: 38 }} iconName="ReminderPerson" />
                                <Text variant="xxLarge">Identity verified!</Text>
                                <div style={{ display: "none" }}>
                                    {setTimeout(() => props.onSuccess({
                                        ...props.projectData,
                                        needsManualReview: false,
                                        downloadLink: `http://microsoft.com/store/apps/${storeId}`
                                    }), 1500)}
                                </div>
                            </Stack>
                        default:
                            return <></>
                    }
                })()
            }
            <Text style={{ color: "red" }}>{errorMessage}</Text>
        </Stack >
    );
};

