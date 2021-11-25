Param (
    [Parameter()]
    [String]
    $PnPVersion = "1.8.0" # ! We might want to get the latest PnP version by default.
)
try{
    Install-PackageProvider -Name NuGet -Force -Scope "CurrentUser"
}catch{
    Write-Host failed to install Nuget
}
if ($PnPVersion -ne $null -and $PnPVersion -ne "") {
    Install-Module PnP.PowerShell -Scope "CurrentUser" -RequiredVersion $PnPVersion -Verbose -AllowClobber -Force
}
else {
    Install-Module PnP.PowerShell -Scope "CurrentUser" -Verbose -AllowClobber -Force
}