import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TooltipHost } from 'office-ui-fabric-react/lib/components/Tooltip';
import React, { useState } from 'react';
import { useId } from '@uifabric/react-hooks';
import styles from '../../MigrationDashboard.module.scss';
import Stakeholder from './Stakeholder';
export interface Props {
    stakeholder: Stakeholder;
}
const tooltipStyles = {
    root: {
        width: "30px",
        float: "right",
        marginLeft: "10px",
    }
};

export const ReadOnlyStakeholder: React.FC<Props> = props => {
    let [iconName, setIconName] = useState("Copy");
    let [tooltipText, setTooltipText] = useState(`Copy ${props.stakeholder.email} to clipboard`);
    const tooltipId = useId(props.stakeholder.email);

    const copyEmailClipboard = async (stakeholder: Stakeholder) => {
        let navigator: any;
        navigator = window.navigator;
        try {
            const stakeholdersAsString = `${stakeholder.name} <${stakeholder.email}>`;
            await navigator.clipboard.writeText(stakeholdersAsString);
            setTooltipText("Copied");
            setIconName("Accept");

            // reset the state in a few seconds:
            setTimeout(() => {
                setTooltipText(`Copy ${stakeholder.email} to clipboard`);
                setIconName("Copy");
            }, 3500);

        } catch (err) {
            console.error('Failed to copy email to clipboard: ', err);
            setTooltipText("Failed to copy");
        }
    };

    return (
        <>
            <span className={styles.PersonaWrapper}>
                <Persona text={props.stakeholder.name}
                    secondaryText={props.stakeholder.email}
                    size={PersonaSize.size40}
                    styles={{
                        root: {
                            width: 320
                        }
                    }}
                />
                <TooltipHost content={tooltipText} id={tooltipId} styles={tooltipStyles} >
                    <DefaultButton
                        iconProps={{ iconName: iconName }}
                        className={styles.textIcon}
                        onClick={() => { copyEmailClipboard(props.stakeholder); }} />
                </TooltipHost>
            </span>
            {/* <span style={{ marginLeft: "auto", marginRight: "15px" }}>
               
            </span> */}
        </>


    );
}; 