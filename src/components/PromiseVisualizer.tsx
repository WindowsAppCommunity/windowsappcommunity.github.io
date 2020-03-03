import * as React from "react";
import { Stack, Spinner, FontIcon, Text } from "office-ui-fabric-react";
import { usePromise } from "../common/helpers";


interface IPromiseVisualizerProps<T> {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    errorStyle?: React.CSSProperties
    onResolve: (result: T) => void
    promise: Promise<T>
    children?: React.ReactNode
}

export function PromiseVisualizer<T>(props: IPromiseVisualizerProps<T>) {
    const promiseState = usePromise(props.promise);
    const { onResolve } = props

    React.useEffect(() => {
        if (promiseState.results) {
            onResolve(promiseState.results)
        }
    }, [promiseState.results, onResolve])
    
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
        return <>{props.children}</>
    }
    return <></>
}