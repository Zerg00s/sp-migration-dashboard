import React from 'react';
import { SiteItem } from '../../Interfaces/SiteItem';
import styles from '../MigrationDashboard.module.scss';
import Section from '../Section/Section';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { SPPermission } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import GeneralInfoSection from './GeneralInfoSection/GeneralInfoSection';
import OwnershipSection from './OwnershipSection/OwnershipSection';
import OtherSection from './OtherSection/OtherSection';
import ChecklistSection from './ChecklistSection/ChecklistSection';
import GeneralControlPanel from './ControlPanel/GeneralControlPanel';
import DocumentLocatorSection from './DocumentLocatorSection/DocumentLocatorSection';

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

        let dataSourceType = "SharePoint";
        if (this.props.currentSite.SiteUrl.startsWith('\\')){
            dataSourceType = "FileShare"
            // or other third type TBD
        }else if (this.props.currentSite.SiteUrl.indexOf('http') != 0){
            dataSourceType = "OneDrive"
        }

        let checkListSection = null;
        let otherSection = null;

        if(dataSourceType == "SharePoint") {
            checkListSection = 
                <PivotItem headerText="Checklist" className={styles.pivotItem} itemKey="2">
                    <Section title="Pre-migration checklist">
                        <ChecklistSection currentSite={this.props.currentSite} />
                    </Section>
                </PivotItem>;
            otherSection =
            <PivotItem headerText="Other" className={styles.pivotItem} itemKey="3">
                <Section title="Other">
                    <OtherSection currentSite={this.props.currentSite} />
                </Section>
            </PivotItem>;
        }

        return (
            <React.Fragment>
                <div className={styles.sectionWrapper}>
                    {/* selectedKey="1" */}
                    <Pivot linkSize={PivotLinkSize.normal}  >

                        <PivotItem headerText="General" className={styles.pivotItem} itemKey="0">
                            <Section title="General Information">
                                <SecurityTrimmedControl context={this.props.context}
                                    level={PermissionLevel.currentWeb}
                                    permissions={[SPPermission.manageWeb]}>
                                    <GeneralControlPanel currentSite={this.props.currentSite} context={this.props.context} dataSourceType = {dataSourceType} />
                                </SecurityTrimmedControl>
                                <GeneralInfoSection currentSite={this.props.currentSite} context={this.props.context} dataSourceType = {dataSourceType} />
                            </Section>

                        </PivotItem>
                        <PivotItem headerText="Ownership" className={styles.pivotItem} itemKey="1">
                            <Section title="Ownership and Communications">
                                <OwnershipSection currentSite={this.props.currentSite} context={this.props.context} />
                            </Section>
                        </PivotItem>
                        { checkListSection }
                        { otherSection }
                        <PivotItem headerText="Document Locator" itemIcon='Search' className={styles.pivotItem} itemKey="4">
                            <Section title="Document Locator">
                                <DocumentLocatorSection currentSite={this.props.currentSite}/>
                            </Section>
                        </PivotItem>
                    </Pivot>
                </div>
            </React.Fragment >
        );
    }
}
