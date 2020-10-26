import { WebPartContext } from '@microsoft/sp-webpart-base';
import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { DataProvider } from '../../../services/DasboardDataProvider';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../../MigrationDashboard.module.scss';

export interface StakeholderProps {
    currentSite: SiteItem;
    context: WebPartContext;
    fieldName: string;
    placeholder: string;
    title: string;
}
interface State {
    editMode: boolean;
}
export default class Stakeholders extends React.Component<StakeholderProps, State> {
    constructor(props: StakeholderProps) {
        super(props);
        this.state = {
            editMode: false
        };
    }

    private cancel = () => {
        this.setState({
            editMode: false
        });
    }

    private saveChanges = () => {
        DataProvider.patchCurrentSiteItem(this.props.context, {
            [this.props.fieldName]: "Denis Molodtsov <denis.molodtsov@gocleverpoint.com>; Denis2 Molodtsov2 <denis2.molodtsov2@gocleverpoint.com>;"
        });

        this.setState({
            editMode: false
        });

    }

    private editMode = () => {
        this.setState({
            editMode: true
        });
    }

    public render() {
        return (
            <React.Fragment>
                <h3>{this.props.title}
                    <SecurityTrimmedControl context={this.props.context}
                        level={PermissionLevel.currentWeb}
                        permissions={[SPPermission.manageWeb]}>
                        {!this.state.editMode &&
                            <DefaultButton
                                iconProps={{ iconName: "Edit" }}
                                className={styles.textEditIcon}
                                onClick={this.editMode} />
                        }
                    </SecurityTrimmedControl>
                </h3>

                <div>
                    {this.props.currentSite[this.props.fieldName] &&
                        <ul>
                            {this.props.currentSite[this.props.fieldName]
                                .split(";")
                                .filter(stakeholder => stakeholder.length != 0)
                                .map(value => <li>{value}</li>)}
                        </ul>
                    }
                </div>
                {this.state.editMode &&

                    <React.Fragment>
                        <PrimaryButton text="Save" className={styles.richTextButton} onClick={this.saveChanges} />
                        <DefaultButton text="Cancel" className={styles.richTextButton} onClick={this.cancel} />
                    </React.Fragment>

                }


            </React.Fragment>
        );
    }
}
