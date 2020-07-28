# SharePoint Migration Dashboard
Planning to migrate your SharePoint Server farm to SharePoint Online? You need this dashboard.
## Why Migration Dashboard?

 Raw [SharePoint Migration Assessment Tool (SMAT)](https://www.microsoft.com/en-us/download/details.aspx?id=53598&WT.mc_id=rss_alldownloads_all)  reports are hard to read. Migration Dashboard presents SMAT data in a human readable form.

## Deploy Migration Dashboard

1. Run `Install-Module SharePointPnPPowerShellOnline` in PowerShell.
1. Navigate to \PowerShell\ Folder and run `Prerequisites.bat`
1. [Create App Catalog Site Collection](https://docs.microsoft.com/en-us/sharepoint/use-app-catalog#step-1-create-the-app-catalog-site-collection) in SharePoint Online if not created.
1. Deploy `sp-migration-dashboard.sppkg` app to App Catalog.
1. In SharePoint Online: 
   * Create an empty site collection for hosting Migration Dashboard.
   * Add sp-migration-dashboard app the empty site collection.
   * Add Migration Dashboard webpart to the home page.
   * Deploy Lists and Libraries by running `Deploy-Dashboard.ps1`
1. Download [SharePoint Migration Assessment Tool (SMAT)](https://www.microsoft.com/en-us/download/details.aspx?id=53598&WT.mc_id=rss_alldownloads_all)
1. Run SMAT in One of the SharePoint Servers in your farm. 
1. Run `Upload_SMAT_Reports.ps1` to upload SMAT reports to the Dashboard site.
