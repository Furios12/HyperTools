param(
    [string]$title = "Notifica",
    [string]$message = "Questo è un messaggio di notifica"
)

$wshell = New-Object -ComObject WScript.Shell
$wshell.Popup($message, 0, $title, 0x0)
