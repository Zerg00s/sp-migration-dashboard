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
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/components/Persona';

import CopyEmailsButton, { CopyEmailsButtonProps } from './CopyEmailsButton';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { StakeholderDialog } from './StakeholderDialog';
import { ReadOnlyStakeholders } from './ReadOnlyStakeholders';

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
    currentStakeholder: Stakeholder;
    currentStakeholderIndex: number;
    isNewStakeholder: boolean;
    dialogHidden: boolean;
}

const tooltipStyles = {
    root: {
        width: "30px",
        float: "right",
        marginLeft: "10px",
    }
};

export default class Stakeholders extends React.Component<StakeholderProps, State> {
    constructor(props: StakeholderProps) {

        super(props);
        this.state = {
            editMode: false,
            stakeholders: convertToStakeholders(this.props.siteItem[this.props.stakeholderFieldName]),
            dialogHidden: true,
            currentStakeholder: { name: "", email: "" },
            currentStakeholderIndex: 0,
            isNewStakeholder: true
        };
    }

    private cancel = () => {
        this.setState({
            editMode: false
        });
    }

    private saveChanges = () => {
        DataProvider.patchCurrentSiteItem(this.props.context, {
            [this.props.stakeholderFieldName]: convertStakeholdersToString(this.state.stakeholders)
        });

        this.setState({
            editMode: false
        });

    }

    private setEditMode = () => {
        this.setState({
            editMode: true
        });
    }


    private onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStakeholders = Array.from(this.state.stakeholders);
        newStakeholders.splice(source.index, 1);
        newStakeholders.splice(destination.index, 0, this.state.stakeholders[source.index]);

        this.setState({
            stakeholders: newStakeholders
        });
    }

    public StakeholderSaved = (stakeholder: Stakeholder) => {
        // Detect duplicate stakeholders
        const duplicateStakeholders = this.state.stakeholders.filter((currentStakeholder => {
            return stakeholder.email.toLowerCase().trim() ===
                currentStakeholder.email.toLowerCase().trim();
        }));

        if (duplicateStakeholders.length > 0) {
            this.setState({
                dialogHidden: true
            });
            return;
        }

        const newStakeholders = Array.from(this.state.stakeholders) as Stakeholder[];

        if (this.state.isNewStakeholder) {
            // Add new stakeholder
            newStakeholders.splice(this.state.currentStakeholderIndex + 1, 0, stakeholder);

        } else {
            // Update existing stakeholder
            newStakeholders[this.state.currentStakeholderIndex] = stakeholder;
        }
        this.setState({
            stakeholders: newStakeholders,
            dialogHidden: true
        });

    }

    public editStakeholderClicked = (index: number) => {
        this.setState({
            currentStakeholderIndex: index,
            currentStakeholder: this.state.stakeholders[index],
            dialogHidden: false,
            isNewStakeholder: false
        });
    }

    public deleteStakeholderClicked = (index: number) => {
        const newStakeholders = Array.from(this.state.stakeholders) as Stakeholder[];
        newStakeholders.splice(index, 1);

        this.setState({
            stakeholders: newStakeholders
        });
    }

    public dialogClosed = () => {
        this.setState({
            dialogHidden: true
        });
    }

    public plusStakeholderClicked = (index: number) => {
        this.setState({
            dialogHidden: false,
            currentStakeholderIndex: index,
            isNewStakeholder: true,
            currentStakeholder: { name: '', email: '' }
        });
    }

    public render() {
        return (
            <div style={{ paddingBottom: "30px" }}>
                <h3>{this.props.title}
                    <SecurityTrimmedControl context={this.props.context}
                        level={PermissionLevel.currentWeb}
                        permissions={[SPPermission.manageWeb]}>

                        <CopyEmailsButton stakeholders={this.state.stakeholders} />

                        {!this.state.editMode &&
                            <TooltipHost content="Edit stakeholders" id="editStakeholdersTooltipID" styles={tooltipStyles} >
                                <DefaultButton
                                    iconProps={{ iconName: "Edit" }}
                                    className={styles.textIcon}
                                    onClick={this.setEditMode} />
                            </TooltipHost>
                        }
                    </SecurityTrimmedControl>
                </h3>


                {
                    !this.state.editMode && // READ ONLY MODE
                    <ReadOnlyStakeholders
                        stakeholdersAsString={this.props.siteItem[this.props.stakeholderFieldName]} />
                }
                {
                    this.state.editMode && // EDIT MODE
                    <React.Fragment>
                        <StakeholderDialog dialogHidden={this.state.dialogHidden}
                            isNewStakeholder={this.state.isNewStakeholder}
                            onDialogClosed={() => { this.dialogClosed(); }}
                            stakeholder={this.state.currentStakeholder}
                            onStakeholderSaved={(savedStakeholder: Stakeholder) => {
                                this.StakeholderSaved(savedStakeholder);
                            }} />

                        <div className={styles.stakeholdersContainer} style={{ overflow: 'auto' }}>
                            {this.props.siteItem[this.props.stakeholderFieldName] &&
                                <DragDropContext onDragEnd={this.onDragEnd}>
                                    <Droppable droppableId="1">
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                <>
                                                    {this.state.stakeholders.map(
                                                        (stakeholder: Stakeholder, index) =>
                                                            <>
                                                                <StakeholderPersona key={stakeholder.email} {...stakeholder}
                                                                    index={index}
                                                                    onEditClick={() => { this.editStakeholderClicked(index); }}
                                                                    onDeleteClick={() => { this.deleteStakeholderClicked(index); }}
                                                                />

                                                                <div className={styles.plusButtonContainer}
                                                                    onClick={() => { this.plusStakeholderClicked(index); }}>
                                                                    <i aria-hidden="true" className={styles.plusButton}>+</i>
                                                                </div>
                                                            </>
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
            </div >
        );
    }
}
