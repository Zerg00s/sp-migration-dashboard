import React from 'react';
import { SiteItem } from '../../Interfaces/SiteItem';
import styles from '../MigrationDashboard.module.scss';
import Section from '../Section/Section';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import GeneralInfoTable from './GeneralInfoTable/GeneralInfoTable';
import CommunicationsTable from './CommunicationsTable/CommunicationsTable';
import OtherTable from './OtherTable/OtherTable';
import ChecklistTable from './ChecklistTable/ChecklistTable';
import GeneralControlPanel from './ControlPanel/GeneralControlPanel';

interface SiteInfoProps {
    currentSite: SiteItem;
    context: WebPartContext;
}

/* Renders information about a single site */
export default class SiteInfo extends React.Component<SiteInfoProps> {

    public render() {
        if (!this.props.currentSite) {
            return <React.Fragment></React.Fragment>;
        }
        return (
            <React.Fragment>
                <div className={styles.sectionWrapper}>
                    <Section title="General Info">
                        <SecurityTrimmedControl context={this.props.context}
                            level={PermissionLevel.currentWeb}
                            permissions={[SPPermission.manageWeb]}>
                            <GeneralControlPanel currentSite={this.props.currentSite} context={this.props.context} /> 
                        </SecurityTrimmedControl>
                    <GeneralInfoTable currentSite={this.props.currentSite} />
                    </Section>
                <Section title="Ownership and Communications">
                    <CommunicationsTable currentSite={this.props.currentSite} />
                </Section>
                <Section title="Pre-migration checklist">
                    <ChecklistTable currentSite={this.props.currentSite} />
                </Section>
                <Section title="Other">
                    <OtherTable currentSite={this.props.currentSite} />
                </Section>
                </div>
            </React.Fragment >
        );
    }
}
