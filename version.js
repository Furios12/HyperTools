const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const puppeteer = require('puppeteer');

// Funzione per ottenere la versione corrente dall'API di GitHub
async function getLatestVersionFromGitHub() {
    const fetch = (await import('node-fetch')).default;
    const owner = 'Furios12'; // Il nome utente o organizzazione di GitHub
    const repo = 'HyperTools'; // Il nome del repository

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/version.txt`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw' // Header per ottenere il contenuto grezzo del file
            }
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Errore dettagliato:', errorDetails);
            throw new Error('Errore nel recupero della versione da GitHub');
        }

        const latestVersion = await response.text();
        return latestVersion.trim(); // Rimuove eventuali spazi o newline extra
    } catch (error) {
        console.error('Errore durante la richiesta a GitHub:', error);
        return null;
    }
}

// Funzione per ottenere la versione corrente dal file locale version.txt
async function getLocalVersion() {
    try {
        const filePath = path.join(__dirname, 'version.txt'); // Costruisce il percorso assoluto per il file
        const localVersion = await fs.readFile(filePath, 'utf8'); // Legge il contenuto del file
        return localVersion.trim(); // Rimuove eventuali spazi o newline extra
    } catch (error) {
        console.error('Errore durante la lettura del file version.txt:', error);
        return null;
    }
}

// Funzione principale per confrontare le versioni
async function checkVersion() {
    const localVersion = await getLocalVersion();
    const latestVersion = await getLatestVersionFromGitHub();

    if (!localVersion || !latestVersion) {
        console.error('Impossibile determinare le versioni per il confronto');
        return;
    }

    if (localVersion === latestVersion) {
        console.log(chalk.green('La versione di HyperTools è aggiornata:', localVersion));
    } else {
        console.log(chalk.red('È disponibile una nuova versione:', latestVersion));
        console.log(chalk.yellow('Sto aprendo il browser..'));

        let browser;
        try {
            // Lancia il browser e configura la finestra
            browser = await puppeteer.launch({
                headless: false, 
                defaultViewport: null, // Imposta la vista predefinita su null per usare la dimensione dello schermo
                args: ['--start-maximized'] // Avvia il browser a schermo intero
            });
            const page = await browser.newPage();

            // Naviga verso l'URL di download
            const url = 'https://hyperstudios.xyz/resources/resource/1-hypertools/';
            console.log(`Navigating to: ${url}`);
            
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Aggiungi qui il selettore del pulsante di download se necessario
            // const downloadButtonSelector = '#download-button'; // Esempio, modifica con il selettore corretto
            // await page.click(downloadButtonSelector);
            console.log(chalk.gray('Si prega di loggarsi per scaricare il file!'))
            console.log(chalk.blue('Perfavore premere il pulsante download, Dopo estrai il zip chiudi il programma e apri il setup di installazione!'));

        } catch (error) {
            console.error('Errore durante la navigazione o il download:', error.message);
        } 
    }

    console.log(chalk.yellow('Versione corrente:', localVersion));
    // Qui potresti aggiungere logica per notificare l'utente o avviare un aggiornamento
}

// Esegui il controllo versione
checkVersion();
