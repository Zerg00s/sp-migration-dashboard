import { WebPartContext } from '@microsoft/sp-webpart-base';
import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { DataProvider } from '../../../services/DasboardDataProvider';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../../MigrationDashboard.module.scss';
import { convertToStakeholders } from './Stakeholder';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export interface StakeholderProps {
    siteItem: SiteItem;
    context: WebPartContext;
    stakeholderFieldName: string;
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
            [this.props.stakeholderFieldName]: "Denis Molodtsov <denis.molodtsov@gocleverpoint.com>; Denis2 Molodtsov2 <denis2.molodtsov2@gocleverpoint.com>;"
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

    private onDragEnd = result => {
        //  
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

                {!this.state.editMode &&
                    <div className={styles.stakeholdersContainer}>
                        {this.props.siteItem[this.props.stakeholderFieldName] &&
                            <>
                                {convertToStakeholders(this.props.siteItem[this.props.stakeholderFieldName])
                                    .map(stakeholder => <span>
                                        <span>{stakeholder.name}</span>
                                        {" <"}<span>{stakeholder.email}</span>{">; "}
                                    </span>)
                                }
                            </>
                        }
                    </div>
                }
                {this.state.editMode &&
                    <React.Fragment>
                        <div className={styles.stakeholdersContainer}>
                            {this.props.siteItem[this.props.stakeholderFieldName] &&
                                <DragDropContext onDragEnd={this.onDragEnd} >
                                    <Droppable droppableId="1">
                                        {provided => (
                                            <div ref={provided.innerRef}
                                                {...provided.droppableProps}>

                                                <Draggable draggableId="1" index={1}>
                                                    {/* {provided2 => {
                                                         <div></div>
                                                         <div>2</div>
                                                    }} */}
                                                </Draggable>

                                                {provided.placeholder}
                                            </div>)
                                        }
                                    </Droppable >
                                </DragDropContext>
                            }

                            {/* {convertToStakeholders(this.props.siteItem[this.props.stakeholderFieldName])
                                            .map(stakeholder => <Draggable>
                                                <strong>{stakeholder.name}</strong>
                                                {" "}
                                                <span>{stakeholder.email}</span>
                                            </Draggable>)
                                        } */}
                        </div>
                        <PrimaryButton text="Save" className={styles.richTextButton} onClick={this.saveChanges} />
                        <DefaultButton text="Cancel" className={styles.richTextButton} onClick={this.cancel} />
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
