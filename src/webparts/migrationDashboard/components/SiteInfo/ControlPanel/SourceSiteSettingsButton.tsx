import React from 'react';
import PropTypes from 'prop-types';
import { SiteItem } from '../../../Interfaces/SiteItem';
import styles from '../../MigrationDashboard.module.scss';
import { DefaultButton } from 'office-ui-fabric-react/lib/components/Button/DefaultButton/DefaultButton';
import { IContextualMenuProps } from 'office-ui-fabric-react/lib/components/ContextualMenu';

interface SiteSettingsProps {
    Title: string;
    SiteUrl: string;
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
                key: 'SitePermissions',
                iconProps: {
                    iconName: 'Signin',
                    style: {
                        color: 'green',
                    },
                },
                text: 'Site permissions',
                href: `${this.props.SiteUrl}/_layouts/user.aspx`,
                target: "_blank",
            },
            {
                key: 'SiteManager',
                iconProps: {
                    iconName: 'ViewListTree',
                    style: {
                        color: 'salmon',
                    },
                },
                text: 'Site Manager',
                href: `${this.props.SiteUrl}/_layouts/sitemanager.aspx`,
                target: "_blank",
            },
            {
                key: 'StorageMetrics',
                iconProps: {
                    iconName: 'OfflineStorage',
                    style: {
                        color: 'salmon',
                    },
                },
                text: 'Storage Metrics',
                href: `${this.props.SiteUrl}/_layouts/storman.aspx`,
                target: "_blank",
            },
            {
                key: 'SiteContents',
                iconProps: {
                    iconName: 'FolderList',
                    style: {
                        color: 'green',
                    },
                },
                text: 'Site Contents',
                href: `${this.props.SiteUrl}/_layouts/viewlsts.aspx`,
                target: "_blank",
            },
            {
                key: 'SiteSettings',
                iconProps: {
                    iconName: 'Settings',
                    style: {
                        color: 'black',
                    },
                },
                text: 'Site Settings',
                href: `${this.props.SiteUrl}/_layouts/settings.aspx`,
                target: "_blank",
            },
            {
                key: 'SiteFeatures',
                iconProps: {
                    iconName: 'Settings',
                    style: {
                        color: 'green',
                    },
                },
                text: 'Site Features',
                href: `${this.props.SiteUrl}/_layouts/ManageFeatures.aspx`,
                target: "_blank",
            },
            {
                key: 'SiteCollectionFeatures',
                iconProps: {
                    iconName: 'Settings',
                    style: {
                        color: 'green',
                    },
                },
                text: 'Site Collection Features',
                href: `${this.props.SiteUrl}/_layouts/ManageFeatures.aspx?Scope=Site`,
                target: "_blank",
            },
        ]
    };


    public render() {
        return (
            <React.Fragment>
                <DefaultButton text={this.props.Title} menuProps={this.settingsButtonProps} className={styles.controlPanelButton} />
            </React.Fragment>
        );
    }
}