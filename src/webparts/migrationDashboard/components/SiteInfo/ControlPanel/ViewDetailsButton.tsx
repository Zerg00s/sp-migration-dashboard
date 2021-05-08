import React from 'react';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrimaryButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../../MigrationDashboard.module.scss';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/components/Panel';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { Constants } from '../../Constants/Constants';

interface ViewDetailsButtonProps {
    context: WebPartContext;
    currentSite: SiteItem;
}
interface State {
    panelOpen: boolean;
}

export default class ViewDetailsButton extends React.Component<ViewDetailsButtonProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            panelOpen: false
        };
    }

    private openMasterPanel = () => {
        this.setState({
            panelOpen: true
        });
    }

    private closeMasterPanel = () => {
        var event = new CustomEvent(`${Constants.Events.RefreshCurrentItem}${this.props.context.webPartTag}`, {});
        window.dispatchEvent(event);
        this.setState({
            panelOpen: false
        });
    }

    public render() {
        return (
            <SecurityTrimmedControl context={this.props.context}
                level={PermissionLevel.currentWeb}
                permissions={[SPPermission.manageWeb]}>

                <PrimaryButton text="View Details"
                    iconProps={{ iconName: "ReviewResponseSolid" }}
                    className={styles.controlPanelButton}
                    onClick={this.openMasterPanel}
                />
                <Panel
                    isLightDismiss
                    className={styles.detailsPanel}
                    isOpen={this.state.panelOpen}
                    onDismiss={this.closeMasterPanel}
                    type={PanelType.medium}
                    closeButtonAriaLabel="Close"
                    headerText={this.props.currentSite.Title}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        src={`${this.props.context.pageContext.web.absoluteUrl}/Lists/SitesReport/DispForm.aspx?ID=${this.props.currentSite.ID}`}
                        frameBorder="0"
                    ></iframe>
                </Panel>
            </SecurityTrimmedControl>
        );
    }
}

