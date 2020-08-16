import React from 'react';
import { SiteItem } from '../../Interfaces/SiteItem';
import styles from '../MigrationDashboard.module.scss';
import Section from '../Section/Section';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { SPPermission } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import GeneralInfoSection from './GeneralInfoSection/GeneralInfoSection';
import CommunicationsSection from './CommunicationsSection/CommunicationsSection';
import OtherSection from './OtherSection/OtherSection';
import ChecklistSection from './ChecklistSection/ChecklistSection';
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
                    <Pivot linkSize={PivotLinkSize.normal}>
                        <PivotItem headerText="General" className={styles.pivotItem}>
                            <Section title="General Information">
                                <SecurityTrimmedControl context={this.props.context}
                                    level={PermissionLevel.currentWeb}
                                    permissions={[SPPermission.manageWeb]}>
                                    <GeneralControlPanel currentSite={this.props.currentSite} context={this.props.context} />
                                </SecurityTrimmedControl>
                                <GeneralInfoSection currentSite={this.props.currentSite} context={this.props.context} />
                            </Section>

                        </PivotItem>
                        <PivotItem headerText="Ownership" className={styles.pivotItem}>
                            <Section title="Ownership and Communications">
                                <CommunicationsSection currentSite={this.props.currentSite} context={this.props.context} />
                            </Section>

                        </PivotItem>
                        <PivotItem headerText="Checklist" className={styles.pivotItem}>
                            <Section title="Pre-migration checklist">
                                <ChecklistSection currentSite={this.props.currentSite} />
                            </Section>

                        </PivotItem>
                        <PivotItem headerText="Other" className={styles.pivotItem}>
                            <Section title="Other">
                                <OtherSection currentSite={this.props.currentSite} />
                            </Section>
                        </PivotItem>
                    </Pivot>
                </div>
            </React.Fragment >
        );
    }
}
