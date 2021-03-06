import React, { useState } from 'react';
import Stakeholder from './Stakeholder';
import { DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';

export interface CopyEmailsButtonProps {
    stakeholders: Stakeholder[];
}
import { useId } from '@uifabric/react-hooks';
import styles from '../../MigrationDashboard.module.scss';

/* 
 Copies all stakeholders to the clipboard.
 Useful if we want to send an email via a mail agent
*/
const CopyEmailsButton: React.FC<CopyEmailsButtonProps> = (props) => {
    let [tooltipText, setTooltipText] = useState("Copy all emails to clipboard");
    let [iconName, setIconName] = useState("Copy");
    const tooltipId = useId('emails2clipboardTooltip');

    const copyEmails2Clipboard = async () => {
        let navigator: any;
        navigator = window.navigator;
        try {
            const stakeholdersAsString = props.stakeholders.map(stakeholder => {
                return `${stakeholder.name} <${stakeholder.email}>`;
            }).join("; ");
            await navigator.clipboard.writeText(stakeholdersAsString);
            setTooltipText("Copied");
            setIconName("Accept");

            // reset the state in a few seconds:
            setTimeout(() => {
                setTooltipText("Copy all emails to clipboard");
                setIconName("Copy");
            }, 3500);

        } catch (err) {
            console.error('Failed to copy emails to clipboard: ', err);
            setTooltipText("Failed to copy");
        }
    };

    const tooltipStyles = {
        root: {
            width: "30px",
            float: "right",
            marginLeft: "10px",
        }
    };

    return (
        <TooltipHost content={tooltipText} id={tooltipId} styles={tooltipStyles} >
            <DefaultButton
                iconProps={{ iconName: iconName }}
                className={styles.textIcon}
                onClick={copyEmails2Clipboard} />
        </TooltipHost>
    );
};

export default CopyEmailsButton;