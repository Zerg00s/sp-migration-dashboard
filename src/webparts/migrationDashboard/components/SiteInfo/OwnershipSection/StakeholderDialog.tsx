import React, { useState } from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType, IDialogFooterProps, IDialogFooterStyles } from 'office-ui-fabric-react/lib/components/Dialog';
import Stakeholder from './Stakeholder';
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import { useBoolean } from '@uifabric/react-hooks';
import { ILabelStyles } from 'office-ui-fabric-react/lib/components/Label';

export interface StakeholderDialogProps {
    onDialogClosed(): void;
    onStakeholderSaved(stakeholder: Stakeholder): void;
    stakeholder: Stakeholder;
    dialogHidden: boolean;
    isNewStakeholder: boolean;
}

function getLabelStyles(): ILabelStyles {
    return {
        root: {
            fontWeight: 600,
            fontSize: 14,
        },
    };
}

function getTextFieldStyles(): Partial<ITextFieldStyles> {
    return {
        root: {
            marginBottom: 12
        },
        subComponentStyles: {
            label: getLabelStyles,
        }
    };
}

function getFooterStyles() {
    return {
        actions: {
            marginTop: 30
        }
    } as IDialogFooterStyles;
}

export const StakeholderDialog: React.FC<StakeholderDialogProps> = (props) => {
    const [stakeholderName, setName] = useState("");
    const [stakeholderEmail, setEmail] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    const [validationError, {
        setFalse: setValidationErrorToFalse,
        setTrue: setValidationErrorToTrue }
    ] = useBoolean(false);


    React.useEffect(() => {
        setDialogTitle(props.isNewStakeholder ? 'New Stakeholder' : "Edit Stakeholder");
    }, [props.isNewStakeholder]);

    React.useEffect(() => {
        setName(props.stakeholder.name);
    }, [props.stakeholder.name, props.stakeholder.email, props.isNewStakeholder]);

    React.useEffect(() => {
        setEmail(props.stakeholder.email);
    }, [props.stakeholder.name, props.stakeholder.email, props.isNewStakeholder]);


    let dialogContentProps = {
        type: DialogType.normal,
        title: dialogTitle,
        subText: `Person associated with the site.`,
        closeButtonAriaLabel: 'Close',
    };

    function getErrorMessage(value) {
        if (value === null ||
            value.trim().length === 0) {
            setValidationErrorToFalse();
            return '';

        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stakeholderEmail)) {
            setValidationErrorToTrue();
            return "Enter a valid email";
        }

        setValidationErrorToFalse();
        return '';
    }

    return (
        <>
            <Dialog
                hidden={props.dialogHidden}
                onDismiss={() => props.onDialogClosed()}
                dialogContentProps={dialogContentProps}

                modalProps={{
                    isBlocking: false,
                    styles: {
                        main: { width: 340, minWidth: 340 },
                    }
                }}
            >

                <TextField
                    label="Name"
                    styles={getTextFieldStyles()}
                    ariaLabel="Name"
                    required
                    value={stakeholderName}
                    inputMode="text"
                    id={'stakeholderName'}
                    placeholder="type first and last name..."
                    onChange={((event, newValue) => { setName(newValue.trim()); })}
                    key={"name"}
                />

                <TextField
                    label="Email"
                    styles={getTextFieldStyles()}
                    ariaLabel="Email"
                    inputMode="email"
                    validateOnFocusOut={true}
                    validateOnLoad={true}
                    onGetErrorMessage={getErrorMessage}
                    required
                    value={stakeholderEmail}
                    id={'stakeholderEmail'}
                    placeholder="type email..."
                    onChange={((event, newValue) => { setEmail(newValue.trim()); })}
                    key={"email"}
                />

                <DialogFooter styles={getFooterStyles()} >
                    <PrimaryButton
                        disabled={stakeholderName === "" || stakeholderEmail === ""}
                        onClick={() => {
                            if (!validationError)
                                props.onStakeholderSaved({ name: stakeholderName, email: stakeholderEmail });
                        }}
                        text="OK" />
                    <DefaultButton
                        onClick={() => props.onDialogClosed()}
                        text="Cancel" />
                </DialogFooter>
            </Dialog>
        </>
    );
};
