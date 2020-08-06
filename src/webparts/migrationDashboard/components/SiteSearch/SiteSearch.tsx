import React from 'react';
import { SearchBox, ISearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { debounce, first, find, filter, orderBy } from 'lodash';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { SiteItem } from '../../Interfaces/SiteItem';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Autocomplete } from '../Autocomplete';
import SiteInfo from '../SiteInfo/SiteInfo';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Constants } from '../Constants/Constants';
import { DataProvider } from '../../services/DasboardDataProvider';




export interface SiteSearchProps {
    siteItems: SiteItem[];
    context: WebPartContext;
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

    public async componentDidMount() {
        window.addEventListener(`${Constants.Events.RefreshCurrentItem}${this.props.context.webPartTag}`, this.refreshCurrentItem);
        window.addEventListener(`${Constants.Events.PatchCurrentItem}${this.props.context.webPartTag}`, this.patchCurrentItem);
    }

    private refreshCurrentItem = async (refreshCurrentListItem: CustomEvent) => {
        let currentSite: SiteItem = await DataProvider.getSiteById(this.state.currentSite.ID);
        this.setState({
            currentSite
        });
    }

    private patchCurrentItem = (masterItemUpdated: CustomEvent) => {
        sp.web.lists.getByTitle(Constants.Lists.SiteReports).items.getById(this.state.currentSite.ID).update(
            {
                [masterItemUpdated.detail.field]: masterItemUpdated.detail.value
            }
        );
        this.refreshCurrentItem(null);
    }

    public render() {
        return (
            <React.Fragment>
                <div>
                    {this.renderSearchBox()}
                </div>
                {this.state.currentSite &&
                    <SiteInfo currentSite={this.state.currentSite} context={this.props.context} />
                }

            </React.Fragment>
        );
    }
}