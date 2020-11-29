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
// const soundFile : any = require("../../../../assets/ding-sound-effect.mp3");

interface Props {
    context: WebPartContext;
    migrationStatus: string;
}
interface State {
    isClicked: boolean;
}

export default class MarkAsMigratedButton extends React.Component<Props, State> {
    private audio = new Audio("/ding-sound-effect.mp3");
    private playSound = () => {
        this.audio.play();
    }

    constructor(props: Props) {

        super(props);
        this.state = {
            isClicked: false
        };

    }



    private setStatusToMigrated = () => {
        this.playSound();
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
                <audio></audio>
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
