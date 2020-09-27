import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import styles from '../../MigrationDashboard.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import ViewDetailsButton from './ViewDetailsButton';
import SiteSettingsButton from './SourceSiteSettingsButton';


interface ControlPanelProps {
    currentSite: SiteItem;
    context: WebPartContext;
}

export default class GeneralControlPanel extends React.Component<ControlPanelProps, {}> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    private wrapStackTokens: IStackTokens = { childrenGap: '0 20 0 0' };

    public render() {
        return (
            <Stack className={styles.stack} horizontal tokens={this.wrapStackTokens}>
                <ViewDetailsButton currentSite={this.props.currentSite} context={this.props.context} />
                <SiteSettingsButton key={this.props.currentSite.SiteUrl} SiteUrl={this.props.currentSite.SiteUrl} Title="Source Site Settings" />
                <SiteSettingsButton key={this.props.currentSite.Id} SiteUrl={this.props.currentSite.TargetSiteUrl} Title="Target Site Settings" />
            </Stack>
        );
    }
}