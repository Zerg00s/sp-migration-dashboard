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
# Load all SharePoint PnP PowersShell Module
# ===================================================

Import-Module PnP.PowerShell -Scope "Local"

Push-Location "..\"

# ===================================================
# Load all PowersShell Utilities from Utils folder
# ===================================================
Get-ChildItem -Path "Utils\*.ps1" -Recurse | ForEach-Object {
    . $_.FullName 
}

$AdminConnection = Connect-SPOnline -ClientId $ClientId -ClientSecret $ClientSecret -SiteUrl $SiteUrl

Write-host Deploying tenant App...

Add-PnPApp -Path "..\..\sharepoint\solution\sp-migration-dashboard.sppkg" -Overwrite -SkipFeatureDeployment:$false -Publish -Connection $AdminConnection

if($AppOnlyDeploy){
    return
}

# ===================================================
# Deploy SharePoint Artifacts to the Site
# ===================================================
Write-host Deploying Lists and Libraries...
Invoke-PnPSiteTemplate -Path ".\Provisioning_Templates\Dashboard_Lists.xml"

Install-PnPApp -Identity ee19878d-ba02-499b-b98e-b05188b7d599

Pop-Location