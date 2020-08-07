import React from 'react';
import PropTypes from 'prop-types';
import { SiteItem } from '../../../Interfaces/SiteItem';
import styles from '../../MigrationDashboard.module.scss';
import { DefaultButton } from 'office-ui-fabric-react/lib/components/Button/DefaultButton/DefaultButton';
import { IContextualMenuProps } from 'office-ui-fabric-react/lib/components/ContextualMenu';

interface SiteSettingsProps {
    currentSite: SiteItem;
}

export default class SiteSettingsButton extends React.Component<SiteSettingsProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }


    private settingsButtonProps: IContextualMenuProps = {
        shouldFocusOnMount: false,
        items: [
            {
                key: 'newItem',
                iconProps: {
                    iconName: 'PlayerSettings',
                },
                text: 'Site permissions',
                href: `${this.props.currentSite.SiteUrl}/_layouts/15/user.aspx`,
                target: "_blank",
            },
            {
                key: 'newItem',
                iconProps: {
                    iconName: 'OfflineStorage',
                },
                text: 'Storage metrics',
                href: `${this.props.currentSite.SiteUrl}/_layouts/sitemanager.aspx`,
                target: "_blank",
            },
        ]
    };


    public render() {
        return (
            <React.Fragment>
                <DefaultButton text="Site Settings" menuProps={this.settingsButtonProps} className={styles.controlPanelButton} />
            </React.Fragment>
        );
    }
}