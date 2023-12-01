import { Text, Stack, PrimaryButton, Checkbox, TextField, DefaultButton, IComboBoxOption, ComboBox, Pivot, PivotItem, IComboBox, Button, IconButton } from "@fluentui/react";
import React, { FormEvent } from "react";
import { IBackendReponseError } from "../../common/interfaces";
import { CreateProject, ModifyProject } from "../../common/services/projects";
import { MicrosoftStoreAppCategories } from "../../common/const";
import { fetchBackend } from "../../common/helpers";
import { IProject } from "../../interface/IProject";
import { Helia } from "../../common/services/helia";
import { ILink } from "../../interface/ILink";

export interface IEditProjectDetailsFormProps {
    onCancel?: Function;
    onSuccess: (updatedProject?: IProject) => void;
    projectData: Partial<IProject>;
    editing?: boolean;
};

/* const roleOptions: IComboBoxOption[] = [
    { key: 1, text: 'Developer', selected: true },
    { key: 2, text: 'Beta tester' },
    { key: 3, text: 'Translator' },
    { key: 4, text: 'Other' }
]; */

const categoryOptions: IComboBoxOption[] = MicrosoftStoreAppCategories.map((category, index) => {
    return { key: category, text: category }
});

export const EditProjectDetailsForm = (props: IEditProjectDetailsFormProps) => {
    let [projectState, setProjectState] = React.useState<Partial<IProject>>({
        isPrivate: false, ...props.projectData
    });

    let [submissionError, setSubmissionError] = React.useState<string>("");
    let [showSuccessIndicator, setShowSuccessIndicator] = React.useState(false);

    async function submitParticipantRequest() {
        let request;
        if (props.editing) {
            if (!props.projectData.name) {
                throw new Error("Unable to modify project details. Missing app name prop");
            }

            props.projectData.name = encodeURIComponent(props.projectData.name);

            request = await ModifyProject(projectState as IProject, { name: props.projectData.name });
        } else {
            request = await CreateProject(projectState as IProject);
        }

        let success = request.status === 200;

        if (!success) {
            let error: IBackendReponseError = await request.json();
            if (error.error && error.reason) {
                setSubmissionError(error.reason);
            }
        } else {
            setShowSuccessIndicator(true);
            setTimeout(() => {
                // TODO. Make a new request to get new project details, the below only is only a temporary solution
                props.onSuccess(projectState as IProject);
            }, 2500);
        }
    }

    function setLink(name: string, newUrl: string) {
        var target = projectState.links?.find(x => x.name = "download");
        if (!target) {
            target = { name: "download", url: newUrl, description: "" } as ILink;
            projectState.links?.push(target)
        }
        else {
            target.url = newUrl;
        }
    }

    return (
        <Stack horizontalAlign="center">
            {/* Need to toggle both src and display so it trigger the animation, and space is taken up during the transition (while the svg loads) */}
            <img style={{ display: (showSuccessIndicator ? "block" : "none"), height: "200px" }} src={showSuccessIndicator ? "/assets/img/checkanimated.svg" : ""} alt="Check" />
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px", display: (!showSuccessIndicator ? "block" : "none") }}>
                <Pivot>
                    <PivotItem headerText="Project">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField label="Project name:" maxLength={75}
                                styles={{ root: { width: "100%" } }}
                                value={projectState.name}
                                required onChange={(e: any, value: any) => setProjectState({ ...projectState, name: value })} />

                            <TextField label="Description" maxLength={240}
                                styles={{ root: { width: "100%" } }}
                                multiline required autoAdjustHeight
                                value={projectState.description}
                                placeholder="Enter a brief description"
                                onChange={(e: any, value: any) => setProjectState({ ...projectState, description: value })} />

                            <ComboBox
                                label="Category"
                                options={categoryOptions}
                                defaultSelectedKey={projectState.category || categoryOptions[0].key}
                                onChange={(e: FormEvent<IComboBox>, option: IComboBoxOption | undefined) => {
                                    if (!option) return;
                                    setProjectState({ ...projectState, category: option.text });
                                }} />

                            <Stack tokens={{ childrenGap: 10 }}>
                                <Text variant="medium" style={{ fontWeight: 600 }}>Features</Text>

                                {(projectState.features ?? []).map((feature, i) =>
                                    <Stack horizontal tokens={{ childrenGap: 5 }} key={i}>
                                        <TextField
                                            type="text"
                                            styles={{ root: { width: "100%" } }}
                                            value={feature}
                                            placeholder="Short feature description"
                                            onChange={(e: any, value: any) => {
                                                (projectState.features ?? [])[i] = value;
                                                setProjectState({ ...projectState });
                                            }} />

                                        <IconButton iconProps={{ iconName: "Cancel" }} onClick={() => setProjectState({ ...projectState, features: [...((projectState.features ?? []).filter((x, index) => i != index))] })} />
                                    </Stack>
                                )}

                                <DefaultButton style={{ marginTop: 5, display: ((projectState.features?.length ?? 0) >= 7) ? "none" : "block" }} text="+ Add Feature" onClick={() => {
                                    setProjectState({ ...projectState, features: [...(projectState.features ?? []), ""] })
                                }} />
                            </Stack>

                            <Checkbox label="Don't display this project publicly"
                                checked={projectState.isPrivate}
                                onChange={(e: any, value: any) => setProjectState({ ...projectState, isPrivate: value })} />
                        </Stack>
                    </PivotItem>

                    <PivotItem headerText="Images">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <DefaultButton onClick={() => {
                                const inputElement = document.createElement('input');
                                inputElement.type = 'file';
                                inputElement.style.display = 'none';
                                inputElement.accept = "image/*";
                                inputElement.click();
                                inputElement.addEventListener('change', function (e: any) {
                                    // Check if a file is selected
                                    const file = e?.target?.files[0];
                                    if (file) {
                                        // Create a FileReader to read the selected file
                                        const reader = new FileReader();

                                        // Set up the FileReader callback function
                                        reader.onload = function (e) {
                                            console.log(e.target?.result);
                                        };

                                        // Read the selected file as a data URL
                                        reader.readAsDataURL(file);
                                    }
                                })


                                // Open dialog to select image file
                                // Add image file to ipfs
                                // Add image CID to project
                                // --- ^^ ---
                                // Submit IProject to server
                                // Server will pull image from client node via CID
                                // Submit project request completes when server has full image
                                // 

                            }} />

                            <TextField label="Project icon"
                                type="url"
                                styles={{ root: { width: "100%" } }}
                                value={projectState.icon?.toString() ?? ""}
                                placeholder="Your project's icon, if applicable"
                                onChange={(e: any, value: any) => setProjectState({ ...projectState, icon: value })} />

                            <TextField label="Hero image"
                                type="url"
                                styles={{ root: { width: "100%" } }}
                                required
                                value={projectState.heroImage?.toString() ?? ""}
                                placeholder="Link to an image of your project"
                                onChange={(e: any, value: any) => setProjectState({ ...projectState, heroImage: value })} />

                            <DefaultButton style={{ marginTop: 25, display: ((projectState.images?.length ?? 0) >= 5) ? "none" : "block" }} text="Add more images" onClick={() => {
                                setProjectState({ ...projectState, images: [...(projectState.images ?? []), "" as any] })
                            }} />

                            {(projectState.images ?? []).map((url, i) =>
                                <Stack horizontal tokens={{ childrenGap: 5 }} key={i}>
                                    <TextField
                                        type="url"
                                        styles={{ root: { width: "100%" } }}
                                        value={url?.toString() ?? ""}
                                        placeholder="Link to an image of your project"
                                        onChange={(e: any, value: any) => {
                                            (projectState.images ?? [])[i] = value;
                                            setProjectState({ ...projectState });
                                        }} />

                                    <IconButton iconProps={{ iconName: "Cancel" }} onClick={() => setProjectState({ ...projectState, images: [...((projectState.images ?? []).filter((x, index) => i != index))] })} />
                                </Stack>
                            )}
                        </Stack>
                    </PivotItem>
                    <PivotItem headerText="Links">
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField label="Download link"
                                value={projectState.links?.find(x => x.name = "download")?.url}
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setLink("download", value as string)} />

                            <TextField label="GitHub link"
                                value={projectState.links?.find(x => x.name = "github")?.url}
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setLink("github", value as string)} />

                            <TextField label="External link"
                                value={projectState.links?.find(x => x.name = "external")?.url}
                                styles={{ root: { width: "100%" } }}
                                onChange={(e: any, value: any) => setLink("external", value as string)} />

                        </Stack>
                    </PivotItem>
                </Pivot>

                <Text style={{ color: "red" }}>{submissionError}</Text>
                <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-evenly" style={{ marginTop: 20 }}>
                    {
                        props.onCancel ?
                            <DefaultButton text="Cancel" onClick={() => props.onCancel ? props.onCancel() : undefined} />
                            : ""
                    }
                    <PrimaryButton text={props.editing ? "Update" : "Register"} onClick={submitParticipantRequest} />
                </Stack>
            </Stack>
        </Stack>
    )
};
