import * as React from 'react';
import { SearchBox, Callout, List, ISearchBox, IRefObject, DirectionalHint } from 'office-ui-fabric-react/lib/';
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
  private _menuButtonElement = React.createRef<HTMLDivElement>();

  constructor(props: IAutocompleteProps) {
    super(props);
    this.state = {
      isSuggestionDisabled: false,
      searchText: this.getDefaultSearchText(),
    };
    this.onSearch(this.getDefaultSearchText());
  }

  private getDefaultSearchText = (): string => {
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    let defaultSiteUrl: string = "";
    if (queryParameters.getValue("SiteUrl")) {
      defaultSiteUrl = queryParameters.getValue("SiteUrl");
    }
    return defaultSiteUrl;
  }
  protected getComponentName(): string {
    return 'SearchSuggestions';
  }
  public handleClick = (site: SiteItem) => {
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
        hidden={!this.state.isSuggestionDisabled}
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
        <List id='SearchList' tabIndex={0}
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
          onClick={() => this.handleClick(site)}>
          {site.SiteUrl}
        </div>
      </div>
    );
  }

  private showSuggestionCallOut() {
    this.setState({ isSuggestionDisabled: true });
  }
  private hideSuggestionCallOut() {
    this.setState({ isSuggestionDisabled: false });
  }
  private suggestedSitesFiltered = (fullListOfSites: SiteItem[]) => {
    if(this.state.searchText === ''){
      return null;
    }
    let suggestedSites = fullListOfSites.filter(site =>
      site.SiteUrl.toLowerCase().includes(this.state.searchText.toLowerCase().trim()));

    suggestedSites = suggestedSites.sort((a, b) => a.SiteUrl.localeCompare(b.SiteUrl));
    if (suggestedSites.length === 0) {
      suggestedSites = [];
    }

    if (suggestedSites.length !== 0) {
      return suggestedSites;
    }

    // No sites found. Maybe users entered a very long URL that includes subsites and document libraries:
    const matchedItemsLongUrl = filter(fullListOfSites, (site: SiteItem) => {
      return this.state.searchText.toLowerCase().trim().indexOf(site.SiteUrl.trim().toLowerCase()) != -1;
    });

    return orderBy(matchedItemsLongUrl, site => site.SiteUrl.length, "desc");
  }

}
