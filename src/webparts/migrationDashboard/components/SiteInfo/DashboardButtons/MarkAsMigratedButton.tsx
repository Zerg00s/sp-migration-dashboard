import { PermissionLevel } from '@pnp/spfx-controls-react/lib/controls/securityTrimmedControl';
import { SecurityTrimmedControl } from '@pnp/spfx-controls-react/lib/controls/securityTrimmedControl/SecurityTrimmedControl';
import { PrimaryButton } from 'office-ui-fabric-react/lib/components/Button/PrimaryButton/PrimaryButton';
import { SPPermission } from '@microsoft/sp-page-context';
import React from 'react';
import styles from '../../MigrationDashboard.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Constants } from '../../Constants/Constants';
import { DataProvider } from '../../../services/DasboardDataProvider';
import { SiteItem } from "../../../Interfaces/SiteItem";


interface Props {
    context: WebPartContext;
    migrationStatus: string;
}
interface State {
    isClicked: boolean;
}
export default class MarkAsMigratedButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isClicked: false
        };
    }
    private setStatusToMigrated = () => {
        this.setState({
            isClicked: true
        });
        DataProvider.patchCurrentSiteItem(this.props.context, {
            "MigrationStatus": "Migrated"
        });
    }

    public render() {
        if (this.state.isClicked || this.props.migrationStatus === "Migrated") {
            return <></>;
        }

        return (
            <React.Fragment>
                <SecurityTrimmedControl context={this.props.context}
                    level={PermissionLevel.currentWeb}
                    permissions={[SPPermission.manageWeb]}>
                    <PrimaryButton text="Mark as Migrated"
                        iconProps={{ iconName: "Accept" }}
                        className={styles.sectionButton}
                        onClick={this.setStatusToMigrated}
                    />
                </SecurityTrimmedControl>
            </React.Fragment>
        );
    }
}
