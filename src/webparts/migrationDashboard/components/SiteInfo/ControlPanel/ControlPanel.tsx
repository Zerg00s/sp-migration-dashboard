import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import styles from '../../MigrationDashboard.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import ViewDetailsButton from './ViewDetailsButton';


interface ControlPanelProps {
    currentSite: SiteItem;
    context: WebPartContext;
}

const SettingsButtonProps = {
    shouldFocusOnMount: false,
    items: [
        {
            key: 'newItem',
            iconProps: {
                iconName: 'PlayerSettings',
            },
            text: 'Site permissions',
        },
        {
            key: 'newItem',
            iconProps: {
                iconName: 'OfflineStorage',
            },
            text: 'Storage metrics',
        },
    ]
};

export default class ControlPanel extends React.Component<ControlPanelProps, {}> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    private wrapStackTokens: IStackTokens = { childrenGap: '0 20 0 0' };

    public render() {
        return (
            <Stack className={styles.stack} horizontal tokens={this.wrapStackTokens}>
                <ViewDetailsButton currentSite={this.props.currentSite} context={this.props.context} />
                <DefaultButton text="Site Settings" menuProps={SettingsButtonProps} className={styles.controlPanelButton} />
            </Stack>
        );
    }
}