import React, { useState } from 'react';
import Stakeholder from './Stakeholder';
import { DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';

export interface CopyEmailsButtonProps {
    stakeholders: Stakeholder[];
}
import { useId } from '@uifabric/react-hooks';
import styles from '../../MigrationDashboard.module.scss';

const CopyEmailsButton: React.FC<CopyEmailsButtonProps> = (props) => {
    let [tooltipText, setTooltipText] = useState("Copy emails to clipboard");
    const tooltipId = useId('emails2clipboardTooltip');

    const copyEmails2Clipboard = async () => {
        let navigator: any;
        navigator = window.navigator;
        try {
            const stakeholdersAsString = props.stakeholders.map(stakeholder => {
                return `${stakeholder.name} <${stakeholder.email}>`;
            }).join(" ;");
            await navigator.clipboard.writeText(stakeholdersAsString);
            setTooltipText("Copied");
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
    }

    return (
        <TooltipHost content={tooltipText} id={tooltipId} styles={tooltipStyles} >
            <DefaultButton
                iconProps={{ iconName: "Copy" }}
                className={styles.textEditIcon}
                onClick={copyEmails2Clipboard} />
        </TooltipHost>
    );
};

export default CopyEmailsButton;