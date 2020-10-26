import React from 'react';
import PropTypes from 'prop-types';
import styles from '../MigrationDashboard.module.scss';

// Section component for wrapping General info, Ownership, Other, etc.

interface SectionProps {
    title: string;
}
export default class Section extends React.Component<SectionProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <React.Fragment>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.subHeading}>{this.props.title}</h2>
                    </div>
                    <div>
                        {this.props.children}
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

