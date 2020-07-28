import { ListItem } from "./ListItem";

export interface SiteItem extends ListItem {
    Farm?: any;
    WebApplicationUrl: string;
    SiteUrl: string;
    SiteOwner: string;
    SiteAdmins: string;
    SiteSizeInMB: number;
    NumOfWebs: number;
    ContentDBName: string;
    ContentDBServerName: string;
    ContentDBSizeInMB: number;
    LastContentModifiedDate: Date;
    TotalItemCount: number;
    DistinctUsers: number;
    Alerts: number;
    Apps: number;
    BCSApplications: number;
    BrowserFileHandling: number;
    CheckedOutFiles: number;
    CustomizedPages: number;
    CustomPermissionLevel: number;
    CustomProfilePropertyMappings: number;
    EmailEnabledLists: number;
    ExternalLists: number;
    FileVersions: number;
    InfoPath: number;
    IRMEnabledLibrary: number;
    LargeLists: number;
    LargeSites: number;
    ManagedMetadataLists: number;
    NonDefaultMasterPages: number;
    PublishingPages: number;
    PublishingSites: number;
    SandboxSolution: number;
    SecureStoreApplications: number;
    UnsupportedWebTemplate: number;
    WorkflowAssociations2010: number;
    WorkflowAssociations2013: number;
    WorkflowRunning2010: number;
    WorkflowRunning2013: number;
    TargetEnvironment: string;
    TargetSiteUrl?: any;
    MigrationStatus?: any;
    ScheduledDate?: any;
    SiteId?: any;
  }
  