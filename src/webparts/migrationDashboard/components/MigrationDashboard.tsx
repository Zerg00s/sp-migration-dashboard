import * as React from 'react';
import styles from './MigrationDashboard.module.scss';
import { IMigrationDashboardProps } from './IMigrationDashboardProps';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { escape } from '@microsoft/sp-lodash-subset';
import { dataProvider } from '../services/DasboardDataProvider';
import { SiteItem } from '../Interfaces/SiteItem';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { TextField, TextFieldBase, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { first, find, filter, orderBy, debounce, cloneDeep, sum } from 'lodash';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

interface State {
  siteItems: SiteItem[];
  loading: boolean;
}
export default class MigrationDashboard extends React.Component<IMigrationDashboardProps, State> {
  public searchInput: ITextField;

  constructor(p: IMigrationDashboardProps) {
    super(p);
    this.state = {
      loading: true,
      siteItems: []
    };
  }

  public async componentDidMount() {
    this.searchInput.focus();
    dataProvider.getSites().then(items => {
      this.setState({
        siteItems: items,
        loading: false
      });
    });

  }

  private onSearchChanged = (text: string): void => {
    if (text.length === 0) {
      // this.resetState();
      return;
    }

    this.setState({
      // currentSite: currentItem,
      // loading: true,
    });

    // this.getSiteReports(currentItem);
  }

  private Content = () => {
    if (!this.state || this.state.loading) {
      return (
        <ProgressIndicator label="Loading..." description={"Retrieving Sites Report list"} />
      )
    }
    return (
      <ErrorBoundary>
        <table>
          {this.state.siteItems && this.state.siteItems.length !== 0 &&
            this.state.siteItems.map(site => <tr><td>{site.Title}</td><td>{site.SiteSizeInMB}</td></tr>)}
        </table>
      </ErrorBoundary>
    );
  }

  public render(): React.ReactElement<IMigrationDashboardProps> {
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    let defaultSiteUrl: string = "";
    if (queryParameters.getValue("SiteUrl")) {
      defaultSiteUrl = queryParameters.getValue("SiteUrl");
    }
    
    return (
      <React.Fragment>
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty} />
        <div>
          <TextField
            id="searchText"
            label={``}
            iconProps={{ iconName: 'Search' }}
            placeholder='Paste SharePoint site URL'
            onBeforeChange={debounce((newValue) => { this.onSearchChanged(newValue); }, 100)}
            componentRef={(input) => this.searchInput = input}
            defaultValue={defaultSiteUrl}
          />
        </div>
        <this.Content />
      </React.Fragment>
    );
  }
}
