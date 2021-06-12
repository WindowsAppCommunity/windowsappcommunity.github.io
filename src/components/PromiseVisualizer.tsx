import * as React from "react";
import { Stack, Spinner, FontIcon, Text } from "office-ui-fabric-react";
import { isReactSnap, usePromise } from "../common/helpers";

interface IPromiseVisualizerProps<T> {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    errorStyle?: React.CSSProperties
    onResolve: (result: T) => void
    promise?: Promise<T>
    children?: React.ReactNode
}

// This component, while it works, is the source of much pain. Poor performance, failing puppeteer crawls, etc.
// TODO: Nuke and try again.
export function PromiseVisualizer<T>(props: IPromiseVisualizerProps<T>) {
    const promiseState = usePromise(props.promise);

    if (promiseState.isLoading) {
        return (
            <Stack horizontalAlign="center" style={props.loadingStyle}>
                <Spinner label={props.loadingMessage} />
            </Stack>
        )
    }

    if (promiseState.error) {
        return (
            <Stack horizontalAlign="center" style={props.errorStyle}>
                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                <Text variant="xLarge">Something went wrong</Text>
            </Stack>
        )
    }

    if (promiseState.results) {
        props.onResolve(promiseState.results);
        return <>{props.children}</>
    }
    return <></>
}