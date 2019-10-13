import * as React from "react";
import { Stack, Spinner, FontIcon, Text } from "office-ui-fabric-react";

interface IPromiseVisualizerProps<T> {
    loadingMessage?: string
    loadingStyle?: React.CSSProperties
    errorStyle?: React.CSSProperties
    hook: [T, React.Dispatch<T>],
    promise: Promise<T>,
    children?: React.ReactNode
}

export interface IStatePromiseState<T> {
    results?: T
    error?: Error
    isLoading: boolean
}

export function PromiseVisualizer<T>(props: IPromiseVisualizerProps<T>) {
    const initialState: IStatePromiseState<T> = { isLoading: false };
    const [visualState, setVisualState] = React.useState<IStatePromiseState<T>>(initialState);
    const [hookData, setHookData] = props.hook;

    async function runPromise() {
        setVisualState(prevState => ({ ...prevState, isLoading: true }));

        try {
            let results = await props.promise;
            setHookData(results);
            setVisualState(prevState => ({ ...prevState, isLoading: false }));
        } catch (error) {
            setVisualState(prevState => ({ ...prevState, isLoading: false, error }));
        }
    }

    React.useEffect(() => {
        runPromise();
    }, [])

    if (visualState.isLoading) {
        return (
            <Stack horizontalAlign="center" style={props.loadingStyle}>
                <Spinner label={props.loadingMessage} />
            </Stack>
        )
    }

    if (visualState.error) {
        return (
            <Stack horizontalAlign="center" style={props.errorStyle}>
                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                <Text variant="xLarge">Something went wrong</Text>
            </Stack>
        )
    }

    /* If not loading and no error */
    return <>{props.children}</>
}