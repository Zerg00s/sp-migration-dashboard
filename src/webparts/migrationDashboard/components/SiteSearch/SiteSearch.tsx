import React from 'react';
import { SearchBox, ISearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { debounce, first, find, filter, orderBy } from 'lodash';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { SiteItem } from '../../Interfaces/SiteItem';

import { Autocomplete } from '../Autocomplete';
import SiteInfo from '../SiteInfo/SiteInfo';




export interface SiteSearchProps {
    siteItems: SiteItem[];
}
export interface SiteSearchState {
    currentSite: SiteItem;
}
export default class SiteSearch extends React.Component<SiteSearchProps, SiteSearchState> {
    public searchBox: ISearchBox;
    constructor(props) {
        super(props);
        this.state = {
            currentSite: null
        };
    }

    private entitySelectHandler = (site: SiteItem): void => {
        this.setState({
            currentSite: site
        });
    }

    private searchTextandler = (site: SiteItem): void => {
        this.setState({
            currentSite: site
        });
    }

    private resetState = () => {
        this.setState({
            currentSite: null
        });
    }

    private renderSearchBox = () => {
        return <Autocomplete
            items={this.props.siteItems}
            searchTitle='Search SharePoint site...'
            suggestionCallback={this.entitySelectHandler}
            searchCallback={this.searchTextandler}
            componentRef={(searchBox) => this.searchBox = searchBox}
        />;
    }
    public render() {
        return (
            <React.Fragment>
                <div>
                    {this.renderSearchBox()}
                </div>
                {this.state.currentSite &&
                    <SiteInfo currentSite={this.state.currentSite} />
                }

            </React.Fragment>
        );
    }
}