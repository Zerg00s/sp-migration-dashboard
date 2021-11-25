Param (
    [Parameter()]
    [String]
    $PnPVersion = "3.23.2007.1"
)
Install-PackageProvider -Name NuGet -Force -Scope "CurrentUser"
if ($PnPVersion -ne $null -and $PnPVersion -ne "") {
    Install-Module PnP.PowerShell -Scope "CurrentUser" -RequiredVersion $PnPVersion -Verbose -AllowClobber -Force
}
else {
    Install-Module PnP.PowerShell -Scope "CurrentUser" -Verbose -AllowClobber -Force
}