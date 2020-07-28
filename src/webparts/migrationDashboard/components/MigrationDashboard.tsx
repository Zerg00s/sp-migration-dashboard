import * as React from 'react';
import styles from './MigrationDashboard.module.scss';
import { IMigrationDashboardProps } from './IMigrationDashboardProps';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { escape } from '@microsoft/sp-lodash-subset';
import { dataProvider } from '../services/DasboardDataProvider';
import { SiteItem } from '../Interfaces/SiteItem';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';    


interface State {
  siteItems: SiteItem[];
}
export default class MigrationDashboard extends React.Component<IMigrationDashboardProps, State> {

  public async componentDidMount() {

    dataProvider.getSites().then(items => {
      this.setState({
        siteItems: items
      });
    });

  }

  public render(): React.ReactElement<IMigrationDashboardProps> {
    if(!this.state ){
      return <div>LOADING...</div>;
    }
    return (
      <ErrorBoundary>
        <h1>MIGRATION DASHBOARD</h1>
        
        <table>
          {this.state.siteItems && this.state.siteItems.length !== 0 &&
            this.state.siteItems.map(site => <tr><td>{site.Title}</td><td>{site.SiteSizeInMB}</td></tr>)}
          <tr></tr>
        </table>
      </ErrorBoundary>
    );
  }
}
