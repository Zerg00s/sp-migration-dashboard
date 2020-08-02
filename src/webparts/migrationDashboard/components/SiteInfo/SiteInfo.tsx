import React from 'react';
import PropTypes from 'prop-types';
import { SiteItem } from '../../Interfaces/SiteItem';
import styles from '../MigrationDashboard.module.scss';
import Section from '../Section/Section';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import { FontIcon } from 'office-ui-fabric-react/lib/components/Icon/FontIcon';


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

interface SiteInfoPros {
    currentSite: SiteItem;
}
interface SiteInfoState {
    allItems: IDocument[];
    columns: IColumn[];
}

/* Renders information about a single site */
export default class SiteInfo extends React.Component<SiteInfoPros, SiteInfoState> {
    public _allItems: IDocument[];

    // DetailsList can't understand when to re-render, unless you re-create
    // Items collection. Every time new props arrive - we recreate Items array
    public static getDerivedStateFromProps(nextProps: SiteInfoPros, prevState: SiteInfoPros) {
        const _allItems = SiteInfo._generateDocuments(nextProps);
        return {
            allItems: _allItems,
        };
    }

    constructor(props: SiteInfoPros) {
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
                    return <FontIcon iconName={item.iconName} style={{ height: 16, width: 16 }} />;
                },
            },
            {
                key: 'Name',
                name: 'Name',
                ariaLabel: 'Name of the property',
                fieldName: 'name',
                isPadded: true,
                isResizable: true,
                minWidth: 40,
                maxWidth: 120,
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

    public static _generateDocuments = (props: SiteInfoPros) => {
        const items: IDocument[] = [];
        if (!props.currentSite === undefined) {
            return items;
        }
        items.push({
            key: "SiteUrl",
            name: "Site URL",
            value: props.currentSite.SiteUrl,
            note: "Old site URL",
            iconName: "Link"
        });
        items.push({
            key: "TargetSiteUrl",
            name: "Target Site URL",
            value: props.currentSite.TargetSiteUrl,
            note: "New site URL",
            iconName: "SharePointLogo"
        });
        items.push({
            key: "SiteSizeInMB",
            name: "Site Size In MB",
            value: props.currentSite.SiteSizeInMB.toString(),
            note: "",
            iconName: "Database"
        });
        items.push({
            key: "NumOfWebs",
            name: "Subsites",
            // TODO: check for NaN
            value: (props.currentSite.NumOfWebs -1).toString(), 
            note: "",
            iconName: "NumberSymbol"
        });
        items.push({
            key: "TotalItemCount",
            name: "Total Items Count",
            // TODO: check for NaN
            value: (props.currentSite.TotalItemCount).toString(), 
            note: "",
            iconName: "NumberSymbol" //  //
        });

        return items;
    }

    private _onRenderItemColumn(item: IDocument, index: number, column: IColumn): JSX.Element {
        console.log(item.key, column.key);
        if (item.key === 'SiteUrl' && column.key === 'Note') {
            return (
                <span>{item.note}</span>
            );
        }
        return item[column.fieldName];
    }

    public render() {
        if (!this.props.currentSite) {
            return <React.Fragment></React.Fragment>;
        }
        return (

            <React.Fragment>
                <div className={styles.sectionWrapper}>
                    <Section title="General Info">
                        <div data-is-scrollable="true">
                            <DetailsList
                                onRenderItemColumn={this._onRenderItemColumn}
                                items={this.state.allItems}
                                compact={true}
                                columns={this.state.columns}
                                selectionMode={SelectionMode.none}
                                setKey="general"
                                layoutMode={DetailsListLayoutMode.justified}
                                isHeaderVisible={true}
                            />

                        </div>

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
