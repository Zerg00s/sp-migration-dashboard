import { PermissionLevel } from '@pnp/spfx-controls-react/lib/controls/securityTrimmedControl';
import { SecurityTrimmedControl } from '@pnp/spfx-controls-react/lib/controls/securityTrimmedControl/SecurityTrimmedControl';
import { PrimaryButton } from 'office-ui-fabric-react/lib/components/Button/PrimaryButton/PrimaryButton';
import { SPPermission } from '@microsoft/sp-page-context';
import React from 'react';
import styles from '../../MigrationDashboard.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DataProvider } from '../../../services/DashboardDataProvider';
import { DefaultButton } from 'office-ui-fabric-react';

// renamed .mp3 file to .svg to piggy-back on the existing webpack loader
const soundFile: any = require<string>("../../../../assets/ding-sound-effect.MP3.svg");

interface Props {
    context: WebPartContext;
    migrationStatus: string;
}
interface State {
    isClicked: boolean;
}

export default class MarkAsMigratedButton extends React.Component<Props, State> {
    private audio = new Audio(soundFile);
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
    private setStatusToScheduled = () => {

        this.setState({
            isClicked: false
        });
        DataProvider.patchCurrentSiteItem(this.props.context, {
            "MigrationStatus": "Scheduled"
        });
    }

    public render() {
        if (this.state.isClicked || this.props.migrationStatus === "Migrated") {
            return <>
                <>
                    <SecurityTrimmedControl context={this.props.context}
                        level={PermissionLevel.currentWeb}
                        permissions={[SPPermission.manageWeb]}>
                        <DefaultButton text="Mark as Scheduled"
                            iconProps={{ iconName: "Calendar" }}
                            onClick={this.setStatusToScheduled}
                        />
                    </SecurityTrimmedControl>
                </>
            </>;
        }

        return (
            <>
                <SecurityTrimmedControl context={this.props.context}
                    level={PermissionLevel.currentWeb}
                    permissions={[SPPermission.manageWeb]}>
                    <PrimaryButton text="Mark as Migrated"
                        iconProps={{ iconName: "Accept" }}
                        className={styles.sectionButton}
                        onClick={this.setStatusToMigrated}
                    />
                </SecurityTrimmedControl>
            </>
        );
    }
}
