import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from '../../MigrationDashboard.module.scss';


export interface StakeholderProps {
    email: string;
    name: string;
    index: number;
}

export default class StakeholderPersona extends React.Component<StakeholderProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Draggable draggableId={this.props.email} index={this.props.index}>
                {(provided) => (
                    <div className={styles.stakeholderPersona}
                        {...provided.draggableProps} ref={provided.innerRef}>
                        <span  {...provided.dragHandleProps} > <strong>Drag Handle</strong> </span>{this.props.name} | {this.props.email}
                    </div>
                )}
            </Draggable>
        );
    }
}
