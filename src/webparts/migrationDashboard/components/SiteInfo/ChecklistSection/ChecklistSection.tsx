import React from 'react';
import { DetailsList, mergeStyleSets, IColumn, FontIcon, SelectionMode, DetailsListLayoutMode } from 'office-ui-fabric-react';
import { SiteItem } from '../../../Interfaces/SiteItem';


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

interface ChecklistSectionState {
    allItems: IDocument[];
    columns: IColumn[];
}

interface ChecklistSectionProps {
    currentSite: SiteItem;
}

export default class ChecklistSection extends React.Component<ChecklistSectionProps, ChecklistSectionState>  {

    public _allItems: IDocument[];

    // DetailsList can't understand when to re-render, unless you re-create
    // Items collection. Every time new props arrive - we recreate Items array
    public static getDerivedStateFromProps(nextProps: ChecklistSectionProps, prevState: ChecklistSectionProps) {
        const _allItems = ChecklistSection._generateDocuments(nextProps);
        return {
            allItems: _allItems,
        };
    }

    constructor(props: ChecklistSectionProps) {
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

    public static _generateDocuments = (props: ChecklistSectionProps) => {
        const items: IDocument[] = [];
        if (!props.currentSite === undefined) {
            return items;
        }
        items.push({
            key: "Alerts",
            name: "Alerts",
            value: props.currentSite.Alerts ? props.currentSite.Alerts.toString() : "",
            note: "",
            iconName: "MailAlert"
        });
        items.push({
            key: "CustomizedPages",
            name: "Customized Pages",
            value: props.currentSite.CustomizedPages ? props.currentSite.CustomizedPages.toString() : "",
            note: "",
            iconName: "FileHTML"
        });
        items.push({
            key: "WorkflowAssociations2010",
            name: "2010 Workflows",
            value: props.currentSite.WorkflowAssociations2010 ? props.currentSite.WorkflowAssociations2010.toString() : "",
            note: "",
            iconName: "WorkFlow"
        });
        items.push({
            key: "WorkflowAssociations2013",
            name: "2013 Workflows",
            value: props.currentSite.WorkflowAssociations2013 ? props.currentSite.WorkflowAssociations2013.toString() : "",
            note: "",
            iconName: "WorkFlow"
        });
        items.push({
            key: "InfoPath",
            name: "InfoPath",
            value: props.currentSite.InfoPath ? props.currentSite.InfoPath.toString() : "",
            note: "",
            iconName: "OfficeFormsLogo"
        });
        items.push({
            key: "NonDefaultMasterPages",
            name: "Custom Master Pages",
            value: props.currentSite.NonDefaultMasterPages ? props.currentSite.NonDefaultMasterPages.toString() : "",
            note: "",
            iconName: "FileHTML"
        });
        items.push({
            key: "CheckedOutFiles",
            name: "Checked Out Files",
            value: props.currentSite.CheckedOutFiles ? props.currentSite.CheckedOutFiles.toString(): "",
            note: "",
            iconName: "PageCheckedOut"
        });
        items.push({
            key: "UnsupportedWebTemplate",
            name: "Unsupported Web Template",
            value: props.currentSite.UnsupportedWebTemplate? props.currentSite.UnsupportedWebTemplate.toString(): "",
            note: "",
            iconName: "WebTemplate"
        });

        return items;
    }

    // Override rendering in specific rows, in specific columns:
    private _onRenderItemColumn(item: IDocument, index: number, column: IColumn): JSX.Element {
        return item[column.fieldName];
    }

    public render() {
        return (
            <React.Fragment>
                <div>
                    {/* <div data-is-scrollable="true"> */}
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
            </React.Fragment>
        );
    }
}

