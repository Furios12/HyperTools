const chalk = require('chalk')
const { exec } = require('child_process');
const { exit } = require('process');
function closeDiscord(callback) {
    console.log(chalk.yellow("Tentativo di chiudere HyperLauncher.."));
    exec('taskkill /IM HyperLauncher.exe /F', (error, stdout, stderr) => {
        if (error) {
            if (error.message.includes('not found') || error.message.includes('non trovato')) {
                console.log(chalk.green('HyperLauncher non è aperto. Continuo con l\'operazione.'));
                exit
            } else {
                console.error(chalk.red(`Errore durante la chiusura di HyperLauncher: ${error.message}`));
                return;
            }
        }
        if (stderr) {
            console.error(chalk.red(`Errore: ${stderr}`));
            return;
        }
        console.log(chalk.green('HyperLauncher chiuso con successo.'));
        setTimeout(callback, 2000); 
    });
}

closeDiscord()