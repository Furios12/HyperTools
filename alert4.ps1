param(
    [string]$title = "HyperTools",
    [string]$message = "Sei sicuro di voler reinstallare discord? Perderai tutte le configurazioni e anche l'accesso al tuo account! Dovrai rieffettuare l'accesso!"
)

Add-Type -AssemblyName System.Windows.Forms

# Percorso del file (stessa directory dello script)
$filePath = Join-Path -Path $PSScriptRoot -ChildPath "value.txt"

# Debug: Mostra il percorso del file
Write-Output "Percorso del file: $filePath"

# Mostra il MessageBox con i pulsanti Sì e No
$result = [System.Windows.Forms.MessageBox]::Show($message, $title, [System.Windows.Forms.MessageBoxButtons]::YesNo)

# Debug: Mostra il risultato della scelta
Write-Output "Risultato del MessageBox: $result"

# Gestisci la risposta dell'utente
if ($result -eq [System.Windows.Forms.DialogResult]::Yes) {
    Write-Output "L'utente ha cliccato Sì. La finestra di dialogo si chiude."
    $valueToWrite = "true"
} elseif ($result -eq [System.Windows.Forms.DialogResult]::No) {
    Write-Output "L'utente ha cliccato No. Terminando il processo HyperLauncher."
    $valueToWrite = "false"
} else {
    Write-Output "Nessuna azione corrisponde alla scelta dell'utente."
}

# Debug: Verifica se $valueToWrite è impostato
if ($null -ne $valueToWrite) {
    Write-Output "Il valore da scrivere è: $valueToWrite"
    
    # Scrivi il valore nel file
    Set-Content -Path $filePath -Value $valueToWrite
    Write-Output "Il valore '$valueToWrite' è stato scritto nel file $filePath."
} else {
    Write-Output "Errore: Nessun valore da scrivere nel file."
}
