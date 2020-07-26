# ========================================================== #
#                 Deploy Lists and Libraries 
#                        required by
#                    Migration Dashboard
# ========================================================== #
$ErrorActionPreference = "Stop"

Write-Host "Provide" -NoNewline
Write-Host " Full Site Collection URL" -ForegroundColor Yellow -NoNewline
Write-Host " for hosting Migration Dashboard: " -NoNewline
$TargetSiteCollectionUrl = Read-Host
if ($null -eq $TargetSiteCollectionUrl) { exit; }

Connect-PnPOnline -UseWebLogin -Url $TargetSiteCollectionUrl
Apply-PnPProvisioningTemplate -Path ".\Provisioning Templates\DashboardLists.xml"

Write-Host "Lists and Libraries have been deployed" -ForegroundColor Green