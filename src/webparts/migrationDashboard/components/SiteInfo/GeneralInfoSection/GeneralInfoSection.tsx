import React from 'react';
import { DetailsList, mergeStyleSets, IColumn, FontIcon, SelectionMode, DetailsListLayoutMode, PrimaryButton } from 'office-ui-fabric-react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import { SecurityTrimmedControl, PermissionLevel } from "@pnp/spfx-controls-react/lib/SecurityTrimmedControl";
import { SPPermission } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import TextNotes from '../OwnershipSection/TextNotes';
import { Constants } from '../../Constants/Constants';
import Measures from '../../../services/Measures';
import styles from '../../MigrationDashboard.module.scss';
import MarkAsMigratedButton from '../DashboardButtons/MarkAsMigratedButton';
import { ConsoleListener } from '@pnp/pnpjs';
import Dates from '../../../services/Dates';

const classNames = mergeStyleSets({
    fileIconHeaderIcon: {
        padding: 0,
        fontSize: '16px',
    },
    fileIconCell: {
        textAlign: 'center',
        selectors: {
            '&:before': {
                content: '.',
                display: 'inline-block',
                verticalAlign: 'middle',
                height: '100%',
                width: '0px',
                visibility: 'hidden',
            },
        },
    },
    fileIconImg: {
        verticalAlign: 'middle',
        maxHeight: '16px',
        maxWidth: '16px',
    },
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    exampleToggle: {
        display: 'inline-block',
        marginBottom: '10px',
        marginRight: '30px',
    },
    selectionDetails: {
        marginBottom: '20px',
    },
});
const controlStyles = {
    root: {
        margin: '0 30px 20px 0',
        maxWidth: '300px',
    },
};

export interface IDocument {
    key: string;
    name: string;
    value: string;
    note: string;
    iconName: string;
}

interface GeneralInfoSectionState {
    allItems: IDocument[];
    columns: IColumn[];
}

interface GeneralInfoSectionProps {
    currentSite: SiteItem;
    context: WebPartContext;
    dataSourceType: string;
}

export default class GeneralInfoSection extends React.Component<GeneralInfoSectionProps, GeneralInfoSectionState> {

    public _allItems: IDocument[];

    // DetailsList can't understand when to re-render, unless you re-create
    // Items collection. Every time new props arrive - we recreate Items array
    public static getDerivedStateFromProps(nextProps: GeneralInfoSectionProps, prevState: GeneralInfoSectionProps) {
        const _allItems = GeneralInfoSection._generateDocuments(nextProps);
        return {
            allItems: _allItems,
        };
    }

    constructor(props: GeneralInfoSectionProps) {
        super(props);
        const columns: IColumn[] = [
            {
                key: 'IconName',
                name: 'Icon Name',
                className: classNames.fileIconCell,
                iconClassName: classNames.fileIconHeaderIcon,
                isIconOnly: true,
                fieldName: 'iconName',
                iconName: 'Page',
                minWidth: 16,
                maxWidth: 16,
                onRender: (item: IDocument) => {
                    return <FontIcon iconName={item.iconName} style={{ height: 16, width: 16, fontSize: 16 }} />;
                },
            },
            {
                key: 'Name',
                name: 'Name',
                ariaLabel: 'Name of the property',
                fieldName: 'name',
                isPadded: true,
                isResizable: true,
                isMultiline: true,
                minWidth: 105,
                maxWidth: 150,
                onRender: (item: IDocument) => {
                    return <span>{item.name}</span>;
                },
            },
            {
                key: 'Value',
                name: 'Value',
                fieldName: 'value',
                minWidth: 120,
                maxWidth: 300,
                isMultiline: true,
                isRowHeader: true,
                isResizable: true,
                isSorted: false,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'Note',
                name: 'Note',
                fieldName: 'note',
                minWidth: 150,
                maxWidth: 600,
                isResizable: true,
                isMultiline: true,
                data: 'any',
                // onRender: (item: IDocument) => {
                //     return <span>{item.note}</span>;
                // },
                isPadded: true,
            },

        ];

        this.state = {
            allItems: this._allItems,
            columns: columns
        };

    }

    public static _generateDocuments = (props: GeneralInfoSectionProps) => {
        const items: IDocument[] = [];
        if (props.currentSite === undefined) {
            return items;
        }
        let name = "Site URL";
        let note = "Old site URL"
        let iconName = "Link"
        if (props.currentSite.SiteUrl.indexOf("\\") === 0) {
            name = "UNC Path";
            note = "Old UNC Path";
            iconName = "FabricFolderLink"
        }
        items.push({
            key: "SiteUrl",
            name: name,
            value: props.currentSite.SiteUrl,
            note: note,
            iconName: iconName
        });
        items.push({
            key: "TargetSiteUrl",
            name: "Target Site URL",
            value: props.currentSite.TargetSiteUrl,
            note: "New site URL",
            iconName: "SharePointLogo"
        });
        items.push({
            key: "TargetLibraryUrl",
            name: "Target Library Url",
            value: props.currentSite.TargetLibraryUrl,
            note: "New library URL",
            iconName: "Library"
        });
        items.push({
            key: "SiteSizeInMB",
            name: "Site Size",
            value: Measures.formatToDigitalSpace(props.currentSite.SiteSizeInMB),
            note: "",
            iconName: "Database"
        });
        if(props.dataSourceType == "SharePoint") { 
            items.push({
                key: "ContentDBSizeInMB",
                name: "Content DB Size",
                value: Measures.formatToDigitalSpace(props.currentSite.ContentDBSizeInMB),
                note: "",
                iconName: "Database"
            });
            items.push({
                key: "NumOfWebs",
                name: "Subsites",
                value: Intl.NumberFormat().format(props.currentSite.NumOfWebs - 1),
                note: "",
                iconName: "NumberSymbol"
            });
        };
        items.push({
            key: "TotalItemCount",
            name: "Total Items Count",
            value: Intl.NumberFormat().format(props.currentSite.TotalItemCount),
            note: "",
            iconName: "NumberSymbol"
        });
        items.push({
            key: "AccessStatus",
            name: "Access Status",
            value: props.currentSite.AccessStatus,
            note: "Source site's status",
            iconName: "Permissions"
        });
        items.push({
            key: "MigrationStatus",
            name: "Migration Status",
            value: props.currentSite.MigrationStatus,
            note: "",
            iconName: "StatusCircleQuestionMark"
        });
        items.push({
            key: "ScheduledDate",
            name: "Migration Date",
            value: props.currentSite.ScheduledDate,
            note: "Migration start date and time",
            iconName: "Calendar"
        });

        return items;
    }

    // Override rendering in specific rows, in specific columns:
    // item.key is the Row key. column.key is the Column Key
    private _onRenderItemColumn = (item: IDocument, index: number, column: IColumn): JSX.Element => {
        if (['SiteUrl', 'TargetSiteUrl'].indexOf(item.key) > -1 && column.key == "Value") {
            return (
                // Render a hyperlink
                <a href={item.value} data-interception="off" target="_blank">{item.value}</a>
            );
        }
        if (['ScheduledDate', '____'].indexOf(item.key) > -1 && column.key == "Value") {
            const scheduledMigrationDate = Dates.getUserFriendlyDate(item.value);
            return (
                <span>{scheduledMigrationDate}</span>
            );
        }
        if (['MigrationStatus', '____'].indexOf(item.key) > -1 && column.key == "Value") {
            return (
                <>
                    <span>{item.value}</span>
                </>
            );
        }
        if (['MigrationStatus'].indexOf(item.key) > -1 && column.key == "Note") {
            return (
                <>
                    {<MarkAsMigratedButton
                        context={this.props.context}
                        migrationStatus={item.value}
                        key={this.props.currentSite.SiteUrl}
                    />}
                </>
            );
        }
        return item[column.fieldName];
    }

    public render() {
        return (
            <>
                <div>
                    <DetailsList
                        onRenderItemColumn={this._onRenderItemColumn}
                        items={this.state.allItems}
                        compact={false}
                        columns={this.state.columns}
                        selectionMode={SelectionMode.none}
                        setKey="general"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                    />
                </div>

                <SecurityTrimmedControl context={this.props.context}
                    level={PermissionLevel.currentWeb}
                    permissions={[SPPermission.manageWeb]}>
                    <TextNotes currentSite={this.props.currentSite}
                        context={this.props.context}
                        key={this.props.currentSite.AdminNotes}
                        fieldName={Constants.SiteFields.AdminNotes}
                        placeholder="Leave notes for your migration team..."
                        title="Notes for the migration team"
                    />
                </SecurityTrimmedControl>
            </>
        );
    }
}

