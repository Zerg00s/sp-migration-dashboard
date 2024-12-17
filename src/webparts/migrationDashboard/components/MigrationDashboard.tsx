import * as React from 'react';
import styles from './MigrationDashboard.module.scss';
import { IMigrationDashboardProps } from './IMigrationDashboardProps';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { DataProvider } from '../services/DashboardDataProvider';
import { SiteItem } from '../Interfaces/SiteItem';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

import SiteSearch from './SiteSearch/SiteSearch';
import { Fabric } from 'office-ui-fabric-react';
import MigrationProgress from './MigrationProgress/MigrationProgress';
const statsLogo: any = require("../../assets/stats.svg");

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

    DataProvider.getSites().then(items => {
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
        <Fabric>
          <Pivot linkSize={PivotLinkSize.large} >
            <PivotItem headerText="Search sites" className={styles.pivotItem} itemIcon="Search" itemKey="0" >
              <SiteSearch context={this.props.context} siteItems={this.state.siteItems} />
            </PivotItem>

            <PivotItem headerText="Migration Progress" className={styles.pivotItem} itemIcon="Slider" itemKey="1" >
              <MigrationProgress context={this.props.context} siteItems={this.state.siteItems} />
            </PivotItem>

          
          </Pivot>
        </Fabric >
      </ErrorBoundary >
    );
  }

  public render(): React.ReactElement<IMigrationDashboardProps> {
    return (
      <div className={styles.migrationDashboard}>
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty}
          className={styles.webpartTitle} />
        <this.Content />
      </div>
    );
  }
}
