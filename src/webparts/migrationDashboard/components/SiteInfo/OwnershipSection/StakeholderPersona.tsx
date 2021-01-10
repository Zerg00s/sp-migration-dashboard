import { DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { FontIcon } from 'office-ui-fabric-react/lib/components/Icon/FontIcon';
import React from 'react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/components/Persona';
import { Draggable } from 'react-beautiful-dnd';
import styles from '../../MigrationDashboard.module.scss';

export interface StakeholderProps {
    email: string;
    name: string;
    index: number;
    onEditClick(): void;
    onDeleteClick(): void;
}

const tooltipStyles = {
    root: {
        width: "30px",
        float: "right",
        marginLeft: "10px",
    }
};

const StakeholderPersona: React.FC<StakeholderProps> = props => {
    return (
        <Draggable draggableId={props.email} index={props.index}>
            {(provided) => (
                <div className={styles.stakeholderPersona}
                    {...provided.draggableProps} ref={provided.innerRef}>
                    <span  {...provided.dragHandleProps} className={styles.drag}>
                        <FontIcon iconName="NumberedListText" className={styles.drag} />
                    </span>
                    <Persona text={props.name} secondaryText={props.email} size={PersonaSize.size40} showSecondaryText={false} />
                    <span style={{ marginLeft: "auto", marginRight: "15px" }}>

                        <DefaultButton
                            iconProps={{ iconName: "Delete" }}
                            className={styles.textIcon}
                            onClick={() => props.onDeleteClick()} />

                        <DefaultButton
                            iconProps={{ iconName: "Edit" }}
                            className={styles.textIcon}
                            onClick={() => props.onEditClick()} />

                    </span>


                </div>
            )}
        </Draggable>
    );
};

export default StakeholderPersona;