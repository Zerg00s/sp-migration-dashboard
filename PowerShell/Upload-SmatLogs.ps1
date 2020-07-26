# ========================================================== #
#            Upload SMAT Logs to SharePoint site.
#               Data is uploaded to the site
#              that hosts Migration Dashboard
# ========================================================== #
$ErrorActionPreference = "Stop"

Write-Host "Provide" -NoNewline
Write-Host " Full Path to SMAT Logs Folder: " -ForegroundColor Yellow -NoNewline
$SmatLogsFolder = Read-Host
$SmatFiles = Get-ChildItem $SmatLogsFolder


$ReportSummaryPath = Join-Path -Path $SmatLogsFolder -ChildPath "SiteAssessmentReport.csv"
if(Test-Path $ReportSummaryPath -PathType leaf){
    Write-Host [Success] $SmatLogsFolder folder is a valid SMAT logs folder -ForegroundColor Green
}else{
    Write-Host [Error] $SmatLogsFolder folder does not contain SMAT Report files. "SiteAssessmentReport.csv is missing" -ForegroundColor red
    exit
}

Write-Host "Provide" -NoNewline
Write-Host " Full Site Collection URL" -ForegroundColor Yellow -NoNewline
Write-Host " for uploading SMAT logs: " -NoNewline
$TargetSiteCollectionUrl = Read-Host
if ($null -eq $TargetSiteCollectionUrl) { exit; }

Connect-PnPOnline -UseWebLogin -Url $TargetSiteCollectionUrl
Write-Host [Success] Connected to $TargetSiteCollectionUrl -ForegroundColor Green

$SmatSites = Import-Csv $ReportSummaryPath
$ExistingSPSiteRecords = Get-PnPListItem -List  Lists/SitesReport 

foreach($SmatRecord in $SmatSites){
    $ExistingSPSiteRecord = $null
    $SiteUrl = $smatRecord.SiteUrl
    Write-Host Processing $SiteUrl -ForegroundColor Yellow

    $ExistingSPSiteRecord = $ExistingSPSiteRecords | Where-Object {$_["SiteUrl"] -eq $SiteUrl }

    $RecordFieldValues = @{
        Title = $SmatRecord.SiteUrl
        SiteUrl = $SmatRecord.SiteUrl
        WebApplicationUrl = $SmatRecord.WebApplicationUrl
        SiteOwner = $SmatRecord.SiteOwner.replace('i:0#.w|', '').replace(';',"`n")
        SiteAdmins = $SmatRecord.SiteAdmins.replace('i:0#.w|', '').replace(';',"`n")
        SiteSizeInMB = $SmatRecord.SiteSizeInMB
        NumOfWebs = $SmatRecord.NumOfWebs
        ContentDBName = $SmatRecord.ContentDBName
        ContentDBServerName = $SmatRecord.ContentDBServerName
        ContentDBSizeInMB = $SmatRecord.ContentDBSizeInMB
        LastContentModifiedDate = $(Get-Date $SmatRecord.LastContentModifiedDate)
        TotalItemCount = $SmatRecord.TotalItemCount
        DistinctUsers = $SmatRecord.DistinctUsers.Replace("N/A", 0)
        Alerts = $SmatRecord.Alerts
        Apps = $SmatRecord.Apps
        BCSApplications = $SmatRecord.BCSApplications
        BrowserFileHandling = $SmatRecord.BrowserFileHandling
        CheckedOutFiles = $SmatRecord.CheckedOutFiles
        CustomizedPages = $SmatRecord.CustomizedPages
        CustomPermissionLevel = $SmatRecord.CustomPermissionLevel
        CustomProfilePropertyMappings = $SmatRecord.CustomProfilePropertyMappings
        EmailEnabledLists = $SmatRecord.EmailEnabledLists
        ExternalLists = $SmatRecord.ExternalLists
        FileVersions = $SmatRecord.FileVersions
        InfoPath = $SmatRecord.InfoPath
        IRMEnabledLibrary = $SmatRecord.IRMEnabledLibrary
        LargeLists = $SmatRecord.LargeLists
        LargeSites = $SmatRecord.LargeSites
        ManagedMetadataLists = $SmatRecord.ManagedMetadataLists
        NonDefaultMasterPages = $SmatRecord.NonDefaultMasterPages
        PublishingPages = $SmatRecord.PublishingPages
        PublishingSites = $SmatRecord.PublishingSites
        SandboxSolution = $SmatRecord.SandboxSolution
        SecureStoreApplications = $SmatRecord.SecureStoreApplications
        UnsupportedWebTemplate = $SmatRecord.UnsupportedWebTemplate
        WorkflowAssociations2010 = $SmatRecord.WorkflowAssociations2010
        WorkflowAssociations2013 = $SmatRecord.WorkflowAssociations2013
        WorkflowRunning2010 = $SmatRecord.WorkflowRunning2010
        WorkflowRunning2013 = $SmatRecord.WorkflowRunning2013
        SiteId = $SmatRecord.SiteId
    }

    if($ExistingSPSiteRecord){
        $suppress = Set-PnPListItem -List Lists/SitesReport -Identity $ExistingSPSiteRecord.Id -Values $RecordFieldValues
        Write-Host Updated List item for $SiteUrl site. -ForegroundColor Green
    }else{
        Write-Host Could not find $SiteUrl Adding new record -ForegroundColor Yellow
        $suppress = Add-PnPListItem -List Lists/SitesReport -Values $RecordFieldValues
    }
}

