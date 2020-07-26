@ECHO OFF
Powershell.exe -NoProfile -ExecutionPolicy Unrestricted -Command "& {Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force}"
ECHO Execution Policy was set to 'Unrestricted'
Powershell.exe -NoProfile -ExecutionPolicy Unrestricted -Command "& {Get-ChildItem -Recurse | Unblock-File}"
ECHO Script files in this folder are unblocked
PAUSE

REM TODO:Install-Module SharePointPnPPowerShellOnline