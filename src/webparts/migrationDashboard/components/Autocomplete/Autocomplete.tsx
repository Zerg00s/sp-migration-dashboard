import * as React from 'react';
import { SearchBox, Callout, List, ISearchBox, IRefObject, DirectionalHint, IList } from 'office-ui-fabric-react/lib/';
import {
  IAutocompleteProps, IAutocompleteState,
  AutocompleteStyles, SuggestionListStyle,
  SuggestionListItemStyle
} from '.';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { debounce, filter, orderBy, first } from 'lodash';
import { SiteItem } from '../../Interfaces/SiteItem';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
  public searchBox: ISearchBox;
  public searchList: IList;
  private _menuButtonElement = React.createRef<HTMLDivElement>();

  constructor(props: IAutocompleteProps) {
    super(props);
    this.state = {
      isSuggestionDisabled: true,
      searchText: this.getDefaultSearchText(),
    };
    this.onSearch(this.getDefaultSearchText());
  }

  private getDefaultSearchText = (): string => {
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    let defaultSiteUrl: string = "";
    if (queryParameters.getValue("SiteUrl")) {
      defaultSiteUrl = queryParameters.getValue("SiteUrl");
      // Unescape the URL
      defaultSiteUrl = decodeURIComponent(defaultSiteUrl);
    }
    return defaultSiteUrl;
  }
  protected getComponentName(): string {
    return 'SearchSuggestions';
  }
  public handleSiteSelect = (site: SiteItem) => {
    this.props.suggestionCallback(site);
    this.setState({
      searchText: site.SiteUrl
    });
    this.hideSuggestionCallOut();
  }
  private onSearch(enteredSiteUrl: string) {
    const filteredItem = first(this.suggestedSitesFiltered(this.props.items));
    if (!filteredItem) {
      return;
    }
    this.props.searchCallback(filteredItem);
    this.setState({
      searchText: filteredItem.SiteUrl
    });
    this.hideSuggestionCallOut();
  }
  public render() {
    return (
      this.renderSearch()
    );
  }

  public componentDidMount() {
    if (this.searchBox) {
      this.searchBox.focus();
    }
  }
  private handleKeyDownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // We can press down arrow key to select one of the search suggestions
    if (event.key === "ArrowDown") {
      const firstSiggestedSite = document.querySelector("#SitesSearchList [role='listitem'] [data-is-focusable='true']") as HTMLElement;
      if (firstSiggestedSite) {
        firstSiggestedSite.setAttribute("TabIndex", "0");
        firstSiggestedSite.focus();
      }
    }
  }
  private handleKeyDownList = (event: React.KeyboardEvent<HTMLDivElement | List<SiteItem>>) => {
    // When we press Enter against selected site suggestion
    if (event.key === "Enter") {
      const targetItem = event.target as HTMLElement;
      const selectedSiteUrl = targetItem.innerText.trim();
      this.setState({
        searchText: targetItem.innerText.trim(),
        isSuggestionDisabled: true
      });
      const selectedSite = first(filter(this.props.items, (item) => item.SiteUrl === selectedSiteUrl));
      this.props.suggestionCallback(selectedSite);
      this.searchBox.focus();
    }
  }
  private renderSearch = () => {
    return (
      <div ref={this._menuButtonElement} style={AutocompleteStyles()} >
        <SearchBox
          value={this.state.searchText}
          id={'SuggestionSearchBox'}
          placeholder={this.props.searchTitle}
          onSearch={newValue => this.onSearch(newValue)}
          componentRef={
            (searchBox) => {
              this.searchBox = searchBox;
              return this.props.children;
            }
          }
          onKeyDown={(event) => this.handleKeyDownSearch(event)}
          onChange={debounce((newSearchText => {
            newSearchText.trim() !== '' ? this.showSuggestionCallOut() : this.hideSuggestionCallOut();
            this.setState({ searchText: newSearchText });
          }), 100)}
        />
        {this.renderSuggestions()}
      </div>
    );
  }

  private renderSuggestions = () => {
    return (
      <Callout id='SuggestionContainer'
        ariaLabelledBy={'callout-suggestions'}
        gapSpace={2}
        coverTarget={false}
        alignTargetEdge={false}
        onDismiss={ev => this.hideSuggestionCallOut()}
        setInitialFocus={false}
        hidden={this.state.isSuggestionDisabled}
        calloutMaxHeight={300}
        target={this._menuButtonElement.current}
        directionalHint={DirectionalHint.bottomLeftEdge}
        isBeakVisible={false}
      >
        {this.renderSuggestionList()}
      </Callout >
    );
  }
  private renderSuggestionList = () => {
    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List id='SitesSearchList' tabIndex={0} componentRef={
          (searchList) => {
            this.searchList = searchList;
            return this.props.children;
          }
        }
          onKeyDown={(event) => this.handleKeyDownList(event)}
          items={this.suggestedSitesFiltered(this.props.items)}
          onRenderCell={this.onRenderCell}
        />
      </FocusZone>
    );
  }
  private onRenderCell = (site: SiteItem) => {
    return (
      <div key={site.SiteUrl}
        className={SuggestionListItemStyle.root}
        data-is-focusable={true}
      >
        <div id={'link' + site.ID}
          style={SuggestionListStyle()}
          onClick={() => this.handleSiteSelect(site)}>
          {site.SiteUrl}
        </div>
      </div>
    );
  }

  private showSuggestionCallOut() {
    this.setState({ isSuggestionDisabled: false });
  }
  private hideSuggestionCallOut() {
    this.setState({ isSuggestionDisabled: true });
  }
  private suggestedSitesFiltered = (fullListOfSites: SiteItem[]) => {
    if (this.state.searchText === '') {
      return null;
    }
    let suggestedSites = fullListOfSites.filter(site =>
      site.SiteUrl && site.SiteUrl.toLowerCase().includes(this.state.searchText.toLowerCase().trim()));

    suggestedSites = suggestedSites.sort((a, b) => a.SiteUrl.localeCompare(b.SiteUrl));
    if (suggestedSites.length === 0) {
      suggestedSites = [];
    }

    if (suggestedSites.length !== 0) {
      return suggestedSites;
    }

    // No sites found. Maybe users entered a very long URL that includes subsites and document libraries:
    const matchedItemsLongUrl = filter(fullListOfSites, (site: SiteItem) => {
      return site.SiteUrl && this.state.searchText.toLowerCase().trim().indexOf(site.SiteUrl.trim().toLowerCase()) != -1;
    });

    return orderBy(matchedItemsLongUrl, site => site.SiteUrl.length, "desc");
  }

}
