const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const chalk = require('chalk');

console.log(chalk.red(`© Hyper Studios | 2024 - ${new Date().getFullYear()}`));
console.log(chalk.red('Version:'), chalk.red('1.1V'), chalk.green('| Normal State'));
console.log(chalk.red(`All rights reserved`));
console.log(chalk.red('Caricamento..'));


const discordUserDataPaths = [
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Local Storage'), 
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Cookies'),       
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Preferences'),   
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'GPUCache'),      
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Cache'),         
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Code Cache'),    
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Dictionaries')   
];

function isDiscordInstalled() {
    return fs.existsSync(path.join(os.homedir(), 'AppData', 'Roaming', 'Discord'));
}

function closeDiscord(callback) {
    console.log(chalk.yellow("Tentativo di chiudere Discord..."));
    exec('taskkill /IM discord.exe /F', (error, stdout, stderr) => {
        if (error) {
            if (error.message.includes('not found') || error.message.includes('non trovato')) {
                console.log(chalk.green('Discord non è aperto. Continuo con l\'operazione.'));
                return callback();
            } else {
                console.error(chalk.red(`Errore durante la chiusura di Discord: ${error.message}`));
                return;
            }
        }
        if (stderr) {
            console.error(chalk.red(`Errore: ${stderr}`));
            return;
        }
        console.log(chalk.green('Discord chiuso con successo.'));
        setTimeout(callback, 2000);
    });
}

function resetDiscordUserData() {
    discordUserDataPaths.forEach(discordPath => {
        if (fs.existsSync(discordPath)) {
            fs.removeSync(discordPath);
            console.log(chalk.green(`Dati utente eliminati: ${discordPath}`));
        } else {
            console.log(chalk.yellow(`Cartella non trovata: ${discordPath}`));
        }
    });
}

if (isDiscordInstalled()) {
    console.log(chalk.yellow("Discord è installato. Chiusura di Discord..."));
    closeDiscord(() => {
        console.log(chalk.yellow("Eliminazione dei dati utente di Discord..."));
        resetDiscordUserData();
        console.log(chalk.green("Eliminazione completata. Alla prossima apertura di Discord sarà necessario un nuovo login."));
    });
} else {
    console.log(chalk.red("Discord non è installato."));
}
