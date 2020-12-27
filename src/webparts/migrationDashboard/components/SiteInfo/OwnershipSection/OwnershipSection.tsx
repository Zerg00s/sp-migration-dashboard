import React from 'react';
import { DetailsList, mergeStyleSets, IColumn, FontIcon, SelectionMode, DetailsListLayoutMode, DefaultButton, Button, PrimaryButton } from 'office-ui-fabric-react';
import { SiteItem } from '../../../Interfaces/SiteItem';
import TextNotes from './TextNotes';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Constants } from '../../Constants/Constants';
import Stakeholders from './Stakeholders';
import { StakeholderProps } from './Stakeholders';


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

interface OwnershipSectionState {
    allItems: IDocument[];
    columns: IColumn[];
}

interface OwnershipSectionProps {
    currentSite: SiteItem;
    context: WebPartContext;
}

export default class OwnershipSection extends React.Component<OwnershipSectionProps, OwnershipSectionState>  {

    public _allItems: IDocument[];

    // DetailsList can't understand when to re-render, unless you re-create
    // Items collection. Therefore every time new props arrive - we recreate Items array
    public static getDerivedStateFromProps(nextProps: OwnershipSectionProps, prevState: OwnershipSectionProps) {
        const _allItems = OwnershipSection._generateDocuments(nextProps);
        return {
            allItems: _allItems,
        };
    }

    constructor(props: OwnershipSectionProps) {
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

    public static _generateDocuments = (props: OwnershipSectionProps) => {
        const items: IDocument[] = [];
        if (!props.currentSite === undefined) {
            return items;
        }
        items.push({
            key: "SiteOwner",
            name: "Site Owner",
            value: props.currentSite.SiteOwner,
            note: "",
            iconName: "RecruitmentManagement"
        });
        items.push({
            key: "SiteAdmins",
            name: "Site Admins",
            value: props.currentSite.SiteAdmins,
            note: "",
            iconName: "Admin"
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
                <div style={{ paddingBottom: "30px" }}>
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

                <Stakeholders
                    title="Site Stakeholders"
                    siteItem={this.props.currentSite}
                    context={this.props.context}
                    key={this.props.currentSite.Stakeholders}
                    stakeholderFieldName={Constants.SiteFields.Stakeholders}
                    placeholder="Stakeholders responsible for the site"
                />

                <TextNotes currentSite={this.props.currentSite}
                    title="Notes for site stakeholders"
                    context={this.props.context}
                    key={this.props.currentSite.PublicNotes}
                    fieldName={Constants.SiteFields.PublicNotes}
                    placeholder="Leave important notes for the site stakeholders here..."
                />

            </React.Fragment>
        );
    }
}

