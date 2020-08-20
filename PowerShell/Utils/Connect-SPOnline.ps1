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
        $global:TenantAdminUrl = $SpTenantAdminUrl
    }
 
    $SiteUrl = $SiteUrl.TrimEnd('/')
    $credentials = $null
    $AdminConnection = $null;

    $securePass = ConvertTo-SecureString -String $Password -AsPlainText -Force
    $credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $Login, $securePass

    Write-host "Connecting to $global:TenantAdminUrl"
    $AdminConnection = Connect-PnPOnline -Url "$global:TenantAdminUrl" -Credentials $credentials -ReturnConnection
    
    Write-host "Connecting to $SiteUrl"
    Connect-PnPOnline -Url $SiteUrl -Credentials $credentials

    return $AdminConnection

}
