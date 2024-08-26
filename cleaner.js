const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk')
const { exec } = require('child_process');


console.log(chalk.red(`© Hyper Studios | 2024 - ${new Date().getFullYear()}`));
console.log(chalk.red('Version:'), chalk.red('1.1V'), chalk.green('| Normal State'));
console.log(chalk.red(`All rights reserved`));


const discordPaths = [
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord'),
    path.join(os.homedir(), 'AppData', 'Local', 'Discord')
];

function isDiscordInstalled() {
    return discordPaths.some(discordPath => fs.existsSync(discordPath));
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

function deleteDiscordCache() {
    discordPaths.forEach(discordPath => {
        const cachePath = path.join(discordPath, 'Cache');
        if (fs.existsSync(cachePath)) {
            fs.removeSync(cachePath);
            console.log(`Cache eliminata: ${cachePath}`);
        } else {
            console.log(`Cache non trovata: ${cachePath}`);
        }
    });
}

if (isDiscordInstalled()) {
    console.log("Discord è installato. Chiusura di Discord...");
    closeDiscord(() => {
        console.log("Eliminazione delle cache in corso...");
        deleteDiscordCache();
    });
} else {
    console.log("Discord non è installato.");
}