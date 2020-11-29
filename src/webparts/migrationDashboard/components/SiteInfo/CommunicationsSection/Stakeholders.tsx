import { WebPartContext } from '@microsoft/sp-webpart-base';
import React from 'react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { DataProvider } from '../../../services/DasboardDataProvider';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../../MigrationDashboard.module.scss';
import Stakeholder, { convertToStakeholders, convertStakeholdersToString } from './Stakeholder';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import StakeholderPersona from './StakeholderPersona';


export interface StakeholderProps {
    siteItem: SiteItem;
    context: WebPartContext;
    stakeholderFieldName: string;
    placeholder: string;
    title: string;
}
interface State {
    editMode: boolean;
    stakeholders: Stakeholder[];
}
export default class Stakeholders extends React.Component<StakeholderProps, State> {
    constructor(props: StakeholderProps) {
        super(props);
        this.state = {
            editMode: false,
            stakeholders: convertToStakeholders(this.props.siteItem[this.props.stakeholderFieldName])
        };
    }

    private cancel = () => {
        this.setState({
            editMode: false
        });
    }

    private saveChanges = () => {
        DataProvider.patchCurrentSiteItem(this.props.context, {
            [this.props.stakeholderFieldName]:convertStakeholdersToString(this.state.stakeholders)
        });

        this.setState({
            editMode: false
        });

    }

    private editMode = () => {
        this.setState({
            editMode: true
        });

        const g = {
            source: {
                droppableId: "1",
                index: 1
            },
            destination: {
                droppableId: "1",
                index: 0
            },

            droppableId: "1",
            draggableId: "denis2.molodtsov2@gocleverpoint.com",
            reason: "DROP"
        };

    }


    private onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if(!destination){
            return;
        }
        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ){
            return;
        }

        const newStakeholders = Array.from(this.state.stakeholders);
        newStakeholders.splice(source.index, 1);
        newStakeholders.splice(destination.index, 0, this.state.stakeholders[source.index]);

        this.setState({
            stakeholders:newStakeholders
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
                        <div className={styles.stakeholdersContainer} style={{overflow:'auto'}}>
                            {this.props.siteItem[this.props.stakeholderFieldName] &&
                                <DragDropContext onDragEnd={this.onDragEnd}>
                                    <Droppable droppableId="1">
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                <>
                                                    {this.state.stakeholders.map(
                                                        (stakeholder, index) => <StakeholderPersona key={stakeholder.email} {...stakeholder} index={index} />
                                                    )}

                                                    {provided.placeholder}
                                                </>
                                            </div>)
                                        }
                                    </Droppable >
                                </DragDropContext>
                            }
                      
                        </div>
                        <PrimaryButton text="Save" className={styles.richTextButton} onClick={this.saveChanges} />
                        <DefaultButton text="Cancel" className={styles.richTextButton} onClick={this.cancel} />
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
