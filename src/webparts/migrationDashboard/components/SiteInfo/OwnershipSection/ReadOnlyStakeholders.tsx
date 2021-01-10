import React from 'react';
import styles from '../../MigrationDashboard.module.scss';
import Stakeholder, { convertToStakeholders } from './Stakeholder';
import { ReadOnlyStakeholder } from './ReadOnlyStakeholder';
export interface Props {
    stakeholdersAsString: string;
}
export const ReadOnlyStakeholders: React.FC<Props> = props => {
    return (
        <div className={styles.stakeholdersContainer}>
            {props.stakeholdersAsString &&
                <div className={styles.flexContainer}>
                    {convertToStakeholders(props.stakeholdersAsString)
                        .map((stakeholder: Stakeholder, index) => (
                            <ReadOnlyStakeholder stakeholder={stakeholder} />
                        ))
                    }
                </div>
            }
        </div>

    );
};