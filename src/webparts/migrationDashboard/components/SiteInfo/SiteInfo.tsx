import React from 'react';
import PropTypes from 'prop-types';
import { SiteItem } from '../../Interfaces/SiteItem';
import styles from '../MigrationDashboard.module.scss';
import Section from '../Section/Section';


interface SiteInfoPros {
    currentSite: SiteItem;
}
/* Renders information about a single site */
export default class SiteInfo extends React.Component<SiteInfoPros, any> {
    constructor(props: SiteInfoPros) {
        super(props);
        this.state = {};
    }

    public render() {
        if (!this.props.currentSite) {
            return <React.Fragment></React.Fragment>;
        }
        return (
            <React.Fragment>
                <div className={styles.sectionWrapper}>
                    <Section title="General Info">
                        {this.props.currentSite.SiteUrl}
                    </Section>
                    <Section title="Ownership and Communications">
                        {this.props.currentSite.SiteOwner}
                    </Section>
                    <Section title="Other">
                        {this.props.currentSite.ContentDBServerName}
                        {this.props.currentSite.ContentDBName}
                        {this.props.currentSite.ContentDBSizeInMB}
                    </Section>
                </div>
            </React.Fragment>
        );
    }
}
