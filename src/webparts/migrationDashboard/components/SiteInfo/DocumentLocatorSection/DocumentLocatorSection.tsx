import React from 'react';
import { DetailsList, mergeStyleSets, IColumn, FontIcon, SelectionMode, DetailsListLayoutMode, SearchBox } from 'office-ui-fabric-react';
import { SiteItem } from '../../../Interfaces/SiteItem';


export interface IDocument {
    key: string;
    name: string;
    value: string;
    note: string;
    iconName: string;
}

interface DocumentLocatorSectionState {
    searchValue: string;
    fullTargetUrl: string;

}

interface DocumentLocatorSectionProps {
    currentSite: SiteItem;
}

export default class DocumentLocatorSection extends React.Component<DocumentLocatorSectionProps, DocumentLocatorSectionState> {


    constructor(props: DocumentLocatorSectionProps) {
        super(props);
        this.state = {
            searchValue: "",
            fullTargetUrl: ""
        };


    }

    public composeUrl = (urlParts: string[] ) => {
        const resultUrl = urlParts
            .filter(Boolean) // Remove falsy values (null, undefined, empty string, etc.)
            .map(part => part.replace(/\\/g, '/').replace(/^\/|\/$/g, '')) // Normalize each part
            .join('/'); // Join parts with a single slash
        return resultUrl;
    }

    public handleNewSearchValue = (newValue: string) => {
        // TODO: Determine if the source is a UNC Path
        // TODO: Determine if target has a document library and/or folder as a target
           
        let relativeUrl = newValue.replace(this.props.currentSite.SiteUrl, "");

        let fullTargetUrl = this.composeUrl([this.props.currentSite.TargetSiteUrl, this.props.currentSite.TargetLibrary, relativeUrl]);

        this.setState({
            searchValue: newValue,
            fullTargetUrl: fullTargetUrl
        });
    }

    public render() {


        return (
            <React.Fragment>
                <div>
                    <p>This section helps you locate content migrated to Microsoft 365</p>

                    <p><strong>Step 1: Provide the original path</strong></p>
                    <SearchBox placeholder="Paste the original URL here..." onSearch={this.handleNewSearchValue} />

                    {this.state.searchValue !== "" && (
                        <>
                            <p><strong>Step 2: Navigate to the target URL</strong></p>
                            <p> <a target='_blank' href={this.state.fullTargetUrl}>{this.state.fullTargetUrl}</a></p>
                        </>
                    )}


                </div>
            </React.Fragment >
        );
    }
}

