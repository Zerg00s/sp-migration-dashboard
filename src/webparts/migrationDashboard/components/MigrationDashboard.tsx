import * as React from 'react';
import styles from './MigrationDashboard.module.scss';
import { IMigrationDashboardProps } from './IMigrationDashboardProps';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { escape } from '@microsoft/sp-lodash-subset';
import { dataProvider } from '../services/DasboardDataProvider';
import { SiteItem } from '../Interfaces/SiteItem';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import { first, find, filter, orderBy, debounce, cloneDeep, sum } from 'lodash';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import SiteSearch from './SiteSearch/SiteSearch';

interface State {
  siteItems: SiteItem[];
  loading: boolean;
}
export default class MigrationDashboard extends React.Component<IMigrationDashboardProps, State> {


  constructor(p: IMigrationDashboardProps) {
    super(p);
    this.state = {
      loading: true,
      siteItems: []
    };
  }

  public async componentDidMount() {

    dataProvider.getSites().then(items => {
      console.log("done");
      this.setState({
        siteItems: items,
        loading: false
      });
    });

  }

  private Content = () => {
    const shimmerLine = { type: ShimmerElementType.line, height: 25 };
    if (!this.state || this.state.loading) {
      return (
        <React.Fragment>
          <ProgressIndicator />
          <Shimmer shimmerElements={[shimmerLine]} />
        </React.Fragment>

      );
    }

    return (
      <ErrorBoundary>
        <Pivot linkSize={PivotLinkSize.large}>
          <PivotItem headerText="Search sites 🔎" className={styles.pivotItem}>
            <SiteSearch siteItems={this.state.siteItems} />
          </PivotItem>
          <PivotItem headerText="Statistics 📊">
            <h2>🚧 Migration stats 🚧</h2>
          </PivotItem>
        </Pivot>
      </ErrorBoundary>
    );
  }

  public render(): React.ReactElement<IMigrationDashboardProps> {
    return (
      <div className={styles.migrationDashboard}>
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty} 
          className={styles.webpartTitle}/>
        <this.Content />
      </div>
    );
  }
}
