function Connect-SPOnline() {
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory = $true, Position = 0)]
        [ValidateNotNullOrEmpty()]
        [String]$SiteUrl,

        [Parameter(Mandatory = $true, Position = 1)]
        [String]$Login,

        [Parameter(Mandatory = $true, Position = 2)]
        [String]$Password,

        [Parameter(Position = 3, Mandatory = $false)]
        [String]$SpTenantAdminUrl # Some O365 tenants have custom host name URLs

    )

    if ($SpTenantAdminUrl -eq $null -or $SpTenantAdminUrl -eq "") {
        $global:TenantAdminUrl = "https://" + (([System.Uri]$SiteUrl).Host -replace '.sharepoint.com') + "-admin.sharepoint.com"
    }else{
        Write-host Else
    }
 
    $SiteUrl = $SiteUrl.TrimEnd('/')
    Write-host "Connecting to $SiteUrl"
    $credentials = $null
    $AdminConnection = $null;

    $securePass = ConvertTo-SecureString -String $Password -AsPlainText -Force
    $credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $Login, $securePass

    Write-host "Connecting to $global:TenantAdminUrl"
    Write-Host $Login
    Write-Host $Password
    Write-Host $securePass
    $AdminConnection = Connect-PnPOnline -Url $global:TenantAdminUrl -Credentials $credentials -ReturnConnection
    Connect-PnPOnline -Url $SiteUrl -Credentials $credentials

    return $AdminConnection

}
