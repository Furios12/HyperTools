const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { exec, execSync } = require('child_process');
const https = require('https');
const chalk = require('chalk');
const stream = require('stream');
const util = require('util');
const pipeline = util.promisify(stream.pipeline);

console.log(chalk.red(`© Hyper Studios | 2024 - ${new Date().getFullYear()}`));
console.log(chalk.red('Version:'), chalk.red('1.1V'), chalk.green('| Normal State'));
console.log(chalk.red(`All rights reserved`));
console.log(chalk.red('Caricamento...'));

const discordPaths = [
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord'),
    path.join(os.homedir(), 'AppData', 'Local', 'Discord'),
    path.join(os.homedir(), 'AppData', 'Local', 'SquirrelTemp')
];

const discordInstallerURL = 'https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x64';
const installerPath = path.join(os.homedir(), 'Downloads', 'DiscordSetup.exe');

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

function tryRemoveSync(targetPath, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            fs.removeSync(targetPath);
            console.log(chalk.green(`Cartella eliminata: ${targetPath}`));
            return;
        } catch (err) {
            if (i < retries - 1) {
                console.log(chalk.yellow(`Tentativo ${i + 1} fallito, riprovando...`));
                continue;
            } else {
                console.error(chalk.red(`Errore: Impossibile eliminare ${targetPath}: ${err.message}`));
            }
        }
    }
}

function uninstallDiscord() {
    console.log(chalk.yellow("Disinstallazione di Discord..."));
    discordPaths.forEach(discordPath => {
        if (fs.existsSync(discordPath)) {
            tryRemoveSync(discordPath);
        } else {
            console.log(chalk.yellow(`Cartella non trovata: ${discordPath}`));
        }
    });
}

async function downloadDiscordInstaller(callback) {
    console.log(chalk.yellow('Download dell\'installer di Discord in corso...'));

    function getRedirectURL(url, callback) {
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                console.log(chalk.yellow(`Redirecting to ${response.headers.location}`));
                getRedirectURL(response.headers.location, callback);
            } else if (response.statusCode === 200) {
                callback(response);
            } else {
                callback(null, new Error(`Failed to get '${url}' (${response.statusCode})`));
            }
        }).on('error', (err) => {
            callback(null, err);
        });
    }

    try {
        getRedirectURL(discordInstallerURL, (response, error) => {
            if (error) {
                console.error(chalk.red(`Errore durante il download: ${error.message}`));
                return;
            }

            if (!response) {
                console.error(chalk.red(`Errore: nessuna risposta dal server.`));
                return;
            }

            const file = fs.createWriteStream(installerPath);
            pipeline(
                response,
                file
            ).then(() => {
                console.log(chalk.green('Download completato.'));
                callback();
            }).catch(err => {
                fs.unlink(installerPath);
                console.error(chalk.red(`Errore durante il salvataggio del file: ${err.message}`));
            });
        });
    } catch (err) {
        fs.unlink(installerPath);
        console.error(chalk.red(`Errore durante il download: ${err.message}`));
    }
}

function installDiscord() {
    console.log(chalk.yellow('Installazione di Discord in corso...'));
    try {
        execSync(`"${installerPath}"`, { stdio: 'inherit' }); 
        console.log(chalk.green('Discord reinstallato con successo.'));
        
        const maxRetries = 5;
        let retries = 0;

        function removeInstaller() {
            if (fs.existsSync(installerPath)) {
                try {
                    fs.removeSync(installerPath); 
                    console.log(chalk.green("File di installazione rimosso."));
                } catch (err) {
                    if (retries < maxRetries) {
                        retries++;
                        console.log(chalk.yellow(`Tentativo ${retries} di rimozione del file di installazione.`));
                        setTimeout(removeInstaller, 2000); 
                    } else {
                        console.error(chalk.red(`Errore durante la rimozione del file di installazione: ${err.message}`));
                    }
                }
            } else {
                console.log(chalk.yellow("Il file di installazione non esiste."));
            }
        }

        removeInstaller();
    } catch (error) {
        console.error(chalk.red(`Errore durante l'installazione di Discord: ${error.message}`));
    }
}


closeDiscord(() => {
    uninstallDiscord();
    downloadDiscordInstaller(() => {
        installDiscord(() => {
            process.exit()
        });
    });
});
