import * as React from "react";
import { Stack, Spinner, FontIcon, Text } from "office-ui-fabric-react";
import { IPromiseState } from '../common/helpers'

interface PromiseWrapperProps<T> {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    errorMessage?: string
    errorStyle?: React.CSSProperties
    hook: [IPromiseState<T>, (params?: any) => Promise<void>],
    children?: React.ReactNode
}

export function PromiseWrapper<T>(props: PromiseWrapperProps<T>) {
    const [state, runPromise] = props.hook;

    React.useEffect(() => {
        runPromise();
    }, [])

    if (state.isLoading) {
        return (
            <Stack horizontalAlign="center" style={props.loadingStyle}>
                <Spinner label={props.loadingMessage} />
            </Stack>
        )
    }

    if (state.error) {
        return (
            <Stack horizontalAlign="center" style={props.errorStyle}>
                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                <Text variant="xLarge">{props.errorMessage}</Text>
            </Stack>
        )
    }

    return <>
        {props.children}
    </>
}