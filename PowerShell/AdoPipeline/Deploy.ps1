Param (
    [Parameter(Mandatory = $True)]
    [String] $ClientId,
    
    [Parameter(Mandatory = $True)]
    [String] $ClientSecret,

    [Parameter(Mandatory = $True)]
    [String] $SiteUrl,

    [Parameter()]
    [switch] $FistDeploy,

    [Parameter()]
    [switch] $AppOnlyDeploy

)

$ErrorActionPreference = "Stop"

# ===================================================
# Load PnP PowersShell Module
# ===================================================

# Import-Module PnP.PowerShell -Scope "Local"

Push-Location "..\"

# ===================================================
# Load all PowersShell Utilities from Utils folder
# ===================================================
Get-ChildItem -Path "Utils\*.ps1" -Recurse | ForEach-Object {
    . $_.FullName 
}

Write-host "Connecting to $SiteUrl"
Connect-PnPOnline -Url $SiteUrl -ClientId $ClientId -ClientSecret $ClientSecret -WarningAction Ignore

# $global:TenantAdminUrl = "https://" + (([System.Uri]$SiteUrl).Host -replace '.sharepoint.com') + "-admin.sharepoint.com"

try {
    Write-host Deploying tenant App...
    # windows
    Add-PnPApp -Path "..\sharepoint\solution\sp-migration-dashboard.sppkg" -Overwrite -SkipFeatureDeployment:$false -Publish    
}
catch {
    Get-PnPException 
}

if ($AppOnlyDeploy) {
    return
}

# ===================================================
# Deploy SharePoint Artifacts to the Site
# ===================================================
Write-host Deploying Lists and Libraries...
Invoke-PnPSiteTemplate -Path ".\Provisioning_Templates\Dashboard_Lists.xml"

$appID = "991a382a-e20d-4929-acdd-3c9f798e85c1"

$installedApp = Get-PnPApp | Where-Object { $_.Id -eq $appID }
if ($installedApp) {
    if ($installedApp.CanUpgrade) {
        Update-PnPApp $appID
    }    
}
else {
    Install-PnPApp -Identity $appID
}

Pop-Location