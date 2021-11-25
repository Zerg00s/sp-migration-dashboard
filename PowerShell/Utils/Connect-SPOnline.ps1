function Connect-SPOnline() {
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [String]$SiteUrl,

        [Parameter(Mandatory = $true)]
        [String]$ClientId,

        [Parameter(Mandatory = $true)]
        [String]$ClientSecret,

        [Parameter(Mandatory = $false)]
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

    # $securePass = ConvertTo-SecureString -String $Password -AsPlainText -Force
    # $credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $Login, $securePass

    Write-host "Connecting to $global:TenantAdminUrl"
    $AdminConnection = Connect-PnPOnline -Url "$global:TenantAdminUrl" -ClientId $ClientId -ClientSecret $ClientSecret -ReturnConnection
    
    Write-host "Connecting to $SiteUrl"
    Connect-PnPOnline -Url $SiteUrl -ClientId $ClientId -ClientSecret $ClientSecret -WarningAction Ignore

    return $AdminConnection

}
