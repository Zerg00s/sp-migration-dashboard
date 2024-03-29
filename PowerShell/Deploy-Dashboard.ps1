# ========================================================== #
#                 Deploy Lists and Libraries 
#                        required by
#                    Migration Dashboard
# ========================================================== #
param (
    [string]$Path
)
$ErrorActionPreference = "Stop"
Set-Location $Path

Write-Host "Provide" -NoNewline
Write-Host " Full Site Collection URL" -ForegroundColor Yellow -NoNewline
Write-Host " for hosting Migration Dashboard: " -NoNewline
$TargetSiteCollectionUrl = Read-Host
if ($null -eq $TargetSiteCollectionUrl) { exit; }

Connect-PnPOnline -Interactive -Url $TargetSiteCollectionUrl
Invoke-PnPSiteTemplate -Path ".\Provisioning_Templates\Dashboard_Lists.xml"

Write-Host "Lists and Libraries have been deployed" -ForegroundColor Green