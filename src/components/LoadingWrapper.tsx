import * as React from "react";
import { Stack, Spinner } from "office-ui-fabric-react";

interface LoadingWrapperProps {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    isReady: boolean
}

export const LoadingWrapper: React.StatelessComponent<LoadingWrapperProps> = (props) => {
    if (!props.isReady) {
        return (
            <Stack horizontalAlign="center" style={props.loadingStyle}>
                <Spinner label={props.loadingMessage} />
            </Stack>
        )
    }

    return <>
        {props.children}
    </>
}