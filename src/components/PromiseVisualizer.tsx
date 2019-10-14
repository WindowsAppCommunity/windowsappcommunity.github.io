import * as React from "react";
import { Stack, Spinner, FontIcon, Text } from "office-ui-fabric-react";

interface IPromiseVisualizerProps<T> {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    errorStyle?: React.CSSProperties
    stateSetter: any
    promise: Promise<T>,
    children?: React.ReactNode
}

export interface IUsePromiseState<T> {
    results?: T
    error?: Error
    isLoading: boolean
}

export function usePromise<T>(promise: (Promise<T>)): IUsePromiseState<T> {
    const [visualState, setVisualState] = React.useState<IUsePromiseState<T>>({ isLoading: true });

    React.useEffect(() => {
        promise.then(results => {
            setVisualState(prevState => ({ ...prevState, isLoading: false, results }));
        }).catch(error => {
            setVisualState(prevState => ({ ...prevState, isLoading: false, error }));
        });
    }, [visualState]);

    return visualState;
};

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
        props.stateSetter(promiseState.results);
        return <>{props.children}</>
    }
    return <></>
}