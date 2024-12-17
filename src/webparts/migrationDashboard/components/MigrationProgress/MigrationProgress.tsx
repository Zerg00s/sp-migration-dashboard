import React from 'react';
import { ISearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { sumBy } from 'lodash';
import { SiteItem } from '../../Interfaces/SiteItem';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { WebPartContext } from '@microsoft/sp-webpart-base';

const logo: any = require('../../../assets/search.svg');

export interface MigrationProgressProps {
    siteItems: SiteItem[];
    context: WebPartContext;
}

export interface MigrationProgressState {
    currentSite: SiteItem;
}

export default class MigrationProgress extends React.Component<MigrationProgressProps, MigrationProgressState> {
    public searchBox: ISearchBox;
    private baseUrl: string;

    constructor(props) {
        super(props);
        this.state = {
            currentSite: null
        };
        // Store the base URL as a class property during initialization
        this.baseUrl = window.location.href.split('?')[0];
    }

    public async componentDidMount() {
        console.log("Items:", this.props.siteItems.length);
    }

    private formatNumber(num: number | undefined): string {
        return num ? num.toLocaleString('en-US') : '0';
    }

    private calculatePercentage(current: number, total: number): number {
        if (!total) return 0;
        return Math.round((current / total) * 100);
    }

    private getProgressStyle(percentage: number): React.CSSProperties {
        return {
            width: '150px',
            marginRight: '10px'
        };
    }

    public render() {
        const totalItemCount = sumBy(this.props.siteItems, 'TotalItemCount') || 0;
        const totalTargetCount = sumBy(this.props.siteItems, 'TargetItemCount') || 0;

        const tableStyle: React.CSSProperties = {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
        };

        const headerStyle: React.CSSProperties = {
            backgroundColor: '#f8f9fa',
            color: '#495057',
            textAlign: 'left',
            padding: '12px 16px',
            fontWeight: 600,
            borderBottom: '2px solid #dee2e6'
        };

        const cellStyle: React.CSSProperties = {
            padding: '12px 16px',
            borderBottom: '1px solid #dee2e6'
        };

        const totalRowStyle: React.CSSProperties = {
            ...cellStyle,
            backgroundColor: '#f8f9fa',
            fontWeight: 600,
            borderTop: '2px solid #dee2e6'
        };

        const progressContainerStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center'
        };

        const progressTextStyle: React.CSSProperties = {
            minWidth: '45px',
            textAlign: 'right',
            fontWeight: 500
        };

        const progressBarStyle: React.CSSProperties = {
            appearance: 'none',
            width: '150px',
            height: '8px',
            marginRight: '10px',
            borderRadius: '4px',
            overflow: 'hidden',
            border: 'none'
        };

        const urlStyle: React.CSSProperties = {
            color: '#0066cc',
            textDecoration: 'none',
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block'
        };

        const titleLinkStyle: React.CSSProperties = {
            color: 'black',
            textDecoration: 'none',
        };




        return (
            <React.Fragment>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={headerStyle}>Title</th>
                            <th style={headerStyle}>Source</th>
                            <th style={headerStyle}>Total Items</th>
                            <th style={headerStyle}>Migrated Items</th>
                            <th style={headerStyle}>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.siteItems.map((siteItem: SiteItem) => (
                            <tr key={siteItem.Title}>
                                <td style={cellStyle}>
                                    <a href={`${this.baseUrl}?SiteURL=${siteItem.SiteUrl}`} style={titleLinkStyle}>{siteItem.Title}</a>
                                </td>
                                <td style={cellStyle}>
                                    <a href={siteItem.SiteUrl} style={urlStyle} title={siteItem.SiteUrl}>
                                        {siteItem.SiteUrl}
                                    </a>
                                </td>
                                <td style={cellStyle}>{this.formatNumber(siteItem.TotalItemCount)}</td>
                                <td style={cellStyle}>{this.formatNumber(siteItem.TargetItemCount)}</td>
                                <td style={cellStyle}>
                                    <div style={progressContainerStyle}>
                                        <progress
                                            style={progressBarStyle}
                                            value={siteItem.TargetItemCount}
                                            max={siteItem.TotalItemCount}
                                        />
                                        <span style={progressTextStyle}>
                                            {this.calculatePercentage(siteItem.TargetItemCount, siteItem.TotalItemCount)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td style={totalRowStyle}>Total</td>
                            <td style={totalRowStyle}></td>
                            <td style={totalRowStyle}>{this.formatNumber(totalItemCount)}</td>
                            <td style={totalRowStyle}>{this.formatNumber(totalTargetCount)}</td>
                            <td style={totalRowStyle}>
                                <div style={progressContainerStyle}>
                                    <progress
                                        style={progressBarStyle}
                                        value={totalTargetCount}
                                        max={totalItemCount}
                                    />
                                    <span style={progressTextStyle}>
                                        {this.calculatePercentage(totalTargetCount, totalItemCount)}%
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <style>
                    {`
                        progress::-webkit-progress-bar {
                            background-color: #f0f0f0;
                            border-radius: 4px;
                        }
                        
                        progress::-webkit-progress-value {
                            background-color: #0078d4;
                            border-radius: 4px;
                            transition: width 0.3s ease;
                        }
                        
                        progress::-moz-progress-bar {
                            background-color: #0078d4;
                            border-radius: 4px;
                        }
                    `}
                </style>
            </React.Fragment>
        );
    }
}