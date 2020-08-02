import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import './Overrides.module.scss';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import MigrationDashboard from './components/MigrationDashboard';
import { IMigrationDashboardProps } from './components/IMigrationDashboardProps';
import { sp } from "@pnp/sp";

export interface IMigrationDashboardWebPartProps {
  description: string;
  title: string;
}

export default class MigrationDashboardWebPart extends BaseClientSideWebPart<IMigrationDashboardWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      //  to make sure that REST calls are send to the correct relative URL:
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IMigrationDashboardProps> = React.createElement(
      MigrationDashboard,
      {
        description: this.properties.description,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Settings"
          },
          groups: [
            {
              groupName: "General",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "Title"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}