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

// Percorsi comuni di Discord
const discordPaths = [
    path.join(os.homedir(), 'AppData', 'Roaming', 'Discord'),
    path.join(os.homedir(), 'AppData', 'Local', 'Discord'),
    path.join(os.homedir(), 'AppData', 'Local', 'SquirrelTemp')
];

const discordInstallerURL = 'https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x64';
const installerPath = path.join(os.homedir(), 'Downloads', 'DiscordSetup.exe');

// Percorso dell'eseguibile di Discord
const discordExecutablePath = path.join(os.homedir(), 'AppData', 'Local', 'Discord', 'app-1.0.9159', 'Discord.exe'); // Modifica con il percorso corretto

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
        setTimeout(callback, 2000); // Attendi 2 secondi prima di continuare
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

        // Attendi 20-25 secondi per garantire che l'installazione sia completa
        setTimeout(() => {
            closeDiscord(() => {
                optimizeDiscord();
            });
        }, 25000); // 25 secondi
    } catch (error) {
        console.error(chalk.red(`Errore durante l'installazione di Discord: ${error.message}`));
    }
}

function optimizeDiscord() {
    console.log(chalk.yellow('Ottimizzazione di Discord in corso...'));

    // Operazioni di ottimizzazione
    try {
        // Pulisci la cache di Discord
        const cachePaths = [
            path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Cache'),
            path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'Code Cache'),
            path.join(os.homedir(), 'AppData', 'Roaming', 'Discord', 'GPUCache')
        ];

        cachePaths.forEach(cachePath => {
            if (fs.existsSync(cachePath)) {
                tryRemoveSync(cachePath);
            } else {
                console.log(chalk.yellow(`Cache non trovata: ${cachePath}`));
            }
        });

        // Imposta Discord per l'avvio automatico
        const autoStartPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup', 'Discord.lnk');
        if (!fs.existsSync(autoStartPath)) {
            execSync(`powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('${autoStartPath}'); $s.TargetPath='${discordExecutablePath}'; $s.Save()"`);
            console.log(chalk.green('Discord impostato per l\'avvio automatico.'));
        } else {
            console.log(chalk.yellow('Discord è già impostato per l\'avvio automatico.'));
        }

        console.log(chalk.green('Ottimizzazione completata.'));

        // Riavvia Discord
        exec(`"${discordExecutablePath}"`, (error) => {
            if (error) {
                console.error(chalk.red(`Errore durante l'avvio di Discord: ${error.message}`));
            } else {
                console.log(chalk.green('Discord avviato con successo.'));
            }
            process.exit();
        });
    } catch (error) {
        console.error(chalk.red(`Errore durante l'ottimizzazione di Discord: ${error.message}`));
    }
}

closeDiscord(() => {
    uninstallDiscord();
    downloadDiscordInstaller(() => {
        installDiscord();
    });
});
