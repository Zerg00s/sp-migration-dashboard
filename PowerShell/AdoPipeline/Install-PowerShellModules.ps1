Param (
    [Parameter()]
    [String]
    $PnPVersion = "1.8.0"
)
Install-PackageProvider -Name NuGet -Force -Scope "CurrentUser"
if ($PnPVersion -ne $null -and $PnPVersion -ne "") {
    Install-Module PnP.PowerShell -Scope "CurrentUser" -RequiredVersion $PnPVersion -Verbose -AllowClobber -Force
}
else {
    Install-Module PnP.PowerShell -Scope "CurrentUser" -Verbose -AllowClobber -Force
}