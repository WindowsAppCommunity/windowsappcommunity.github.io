import * as React from "react";
import { Stack, Spinner, FontIcon, Text } from "office-ui-fabric-react";

interface IPromiseVisualizerProps<T> {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    errorStyle?: React.CSSProperties
    hook: [IStatePromiseState<T>, (params?: any) => Promise<void>],
    children?: React.ReactNode
}

export interface IStatePromiseState<T> {
    results?: T
    error?: Error
    isLoading: boolean
}

export function useStatePromise<T>(promise: Promise<T>): [IStatePromiseState<T>, (params: T) => Promise<void>] {
    const initialState: IStatePromiseState<T> = { isLoading: false };
    const [result, setResult] = React.useState<IStatePromiseState<T>>(initialState);

    const runPromise = async () => {
        setResult(prevState => ({ ...prevState, isLoading: true }));

        let results: T;
        try {
            results = await promise;
            setResult(prevState => ({ ...prevState, isLoading: false, results }));
        } catch (error) {
            setResult(prevState => ({ ...prevState, isLoading: false, error }));
        }
    }

    return [result, runPromise];
}

export function PromiseVisualizer<T>(props: IPromiseVisualizerProps<T>) {
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
                <Text variant="xLarge">Something went wrong</Text>
            </Stack>
        )
    }

    return <>{props.children}</>
}