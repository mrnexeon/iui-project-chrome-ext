import { Button, CircularProgress } from '@mui/material';
import * as React from 'react';

interface IProps {
    onClick: () => Promise<void>;
    label: string;
    successLabel: string;
}

/**
 * Button that shows loading animation while awaiting async onClick Function
 * If onClick does not throw the button gets disabled afterwards
 *
 * @param props
 * @returns
 */
export const AsyncButton: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [ranSuccessful, setRanSuccessful] = React.useState(false);

    const onClick = React.useCallback(async () => {
        setIsLoading(true);

        try {
            await props.onClick();
        } catch (e) {
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setRanSuccessful(true);
    }, [props.onClick]);

    return (
        <Button onClick={onClick} disabled={ranSuccessful || isLoading}>
            {isLoading && (
                <CircularProgress
                    size="15px"
                    sx={{ marginRight: '5px' }}
                    color="inherit"
                />
            )}
            {ranSuccessful ? props.successLabel : props.label}
        </Button>
    );
};
