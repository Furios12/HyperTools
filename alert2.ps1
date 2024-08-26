param(
    [string]$title = "HyperTools",
    [string]$message = "Sei sicuro di voler reinstallare discord? Tutte le configurazioni verranno cancellate e discord tornera alle impostazioni di fabbrica!"
)

Add-Type -AssemblyName System.Windows.Forms

# Mostra il MessageBox con i pulsanti Sì e No
$result = [System.Windows.Forms.MessageBox]::Show($message, $title, [System.Windows.Forms.MessageBoxButtons]::YesNo)

# Gestisci la risposta dell'utente
if ($result -eq [System.Windows.Forms.DialogResult]::Yes) {
    Write-Output "L'utente ha cliccato Sì. La finestra di dialogo si chiude."
} elseif ($result -eq [System.Windows.Forms.DialogResult]::No) {
    Write-Output "L'utente ha cliccato No. Terminando il processo HyperTools."
    Stop-Process -Name "HyperLauncher" -ErrorAction SilentlyContinue
}
