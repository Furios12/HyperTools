::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFD1BXg2NL1eeA6YX/Ofr0/mEsEQJQONyUJbL36bDAu8HpEznevY=
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSDk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+IeA==
::cxY6rQJ7JhzQF1fEqQJhZkoaHErSXA==
::ZQ05rAF9IBncCkqN+0xwdVsFAlXMbCXqZg==
::ZQ05rAF9IAHYFVzEqQIYMQtRXiiDKWW5DrAOiA==
::eg0/rx1wNQPfEVWB+kM9LVsJDCybLG6oKrQJ5uvz6vjn
::fBEirQZwNQPfEVWB+kM9LVsJDCybLG6oKrQJ5uvz6vjn
::cRolqwZ3JBvQF1fEqQIYMQtRXiiDKWW5DrAOiA==
::dhA7uBVwLU+EWHGd5EciGw9BSA2NLws=
::YQ03rBFzNR3SWATE3FsgLQlnWBGGNWSpZg==
::dhAmsQZ3MwfNWATE3FsgLQlnWBGGNWSpZg==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCyDJGyX8VAjFD1BXg2NL1eeA6YX/Ofr08KeskgPYO0wdJzn8q2eJfI/61Dqdp4oxDRfgM5s
::YB416Ek+ZW8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
setlocal enabledelayedexpansion

:: Verifica se lo script è in esecuzione come amministratore
openfiles >nul 2>&1 || (
    echo [ERROR] Devi aprire il Launcher come amministratore!.
    echo.
    pause
    exit /b
)

:: Imposta la directory dello script
set "scriptDir=%~dp0"

:: Verifica se la cartella "node_modules" esiste e, in caso contrario, esegue "npm install"
if exist "%scriptDir%node_modules\" (
    echo [HyperDebug] La cartella "node_modules" esiste. Salto "npm install".
) else (
    echo [HyperDebug] La cartella "node_modules" non esiste. Eseguo "npm install".
    powershell -ExecutionPolicy Bypass -File "%scriptDir%alert.ps1" -title "HyperLauncher" -message "Avvio installazione. Dopo aver premuto OK, il launcher si chiuderà. Dovrai riaprirlo."
    npm install
)

:: Controlla di nuovo se la cartella "node_modules" esiste dopo l'installazione
if not exist "%scriptDir%node_modules\" (
    echo [HyperDebug] La cartella "node_modules" non esiste. Non posso avviare il menu.
    pause
    exit /b
)

:MENU
cls
title HyperTools - Menu
echo ==========================
echo     HyperTools - Copyright HyperStudios
echo ==========================
echo 1. Esegui il cleaner
echo 2. Esegui il reset di Discord
echo 3. Reinstalla Discord
echo 4. Esci
echo ==========================
set /p option="Seleziona un'opzione [1-4]: "

:: Gestisci le opzioni dell'utente
if "%option%"=="1" goto cleaner
if "%option%"=="2" goto reset
if "%option%"=="3" goto reinstall
if "%option%"=="4" exit /b

:: Se l'opzione non è valida
echo [HyperLauncher] Opzione non valida. Riprova.
timeout /t 2 /nobreak >nul
goto MENU

:cleaner
cls
echo Eseguo cleaner: "%scriptDir%cleaner.js"
node "%scriptDir%cleaner.js"
powershell -ExecutionPolicy Bypass -File "%scriptDir%alert.ps1" -title "HyperTools" -message "Ho pulito discord!"
goto MENU

:reset
cls
echo Eseguo reset: "%scriptDir%reset.js"
powershell -ExecutionPolicy Bypass -File "%scriptDir%alert3.ps1"

:: Specifica il percorso del file (nella stessa directory)
set "filePath=%scriptDir%value.txt"

:: Leggi il contenuto del file riga per riga
for /f "usebackq delims=" %%a in ("%filePath%") do (
    set "fileContent=%%a"
)

:: Rimuovi eventuali spazi bianchi dalla variabile
set "fileContent=!fileContent: =!"

:: Verifica se il contenuto è "true"
if /i "!fileContent!"=="true" (
    node "%scriptDir%reset.js"
    powershell -ExecutionPolicy Bypass -File "%scriptDir%alert.ps1" -title "HyperTools" -message "Reset Completato"
    goto MENU
) else (
    :: Verifica se il contenuto è "false"
    if /i "!fileContent!"=="false" (
        echo Sto annullando...
        goto MENU
    ) else (
        echo Il file contiene un valore diverso da "true" o "false".
        pause
        goto MENU
    )
)

:reinstall
cls
echo Eseguo reinstall: "%scriptDir%install.js"
powershell -ExecutionPolicy Bypass -File "%scriptDir%alert4.ps1"

:: Specifica il percorso del file (nella stessa directory)
set "filePath=%scriptDir%value.txt"

:: Leggi il contenuto del file riga per riga
for /f "usebackq delims=" %%a in ("%filePath%") do (
    set "fileContent=%%a"
)

:: Rimuovi eventuali spazi bianchi dalla variabile
set "fileContent=!fileContent: =!"

:: Verifica se il contenuto è "true"
if /i "!fileContent!"=="true" (
    node "%scriptDir%install.js"
    powershell -ExecutionPolicy Bypass -File "%scriptDir%alert.ps1" -title "HyperTools" -message "Reinstall Completato"
    goto MENU
) else (
    :: Verifica se il contenuto è "false"
    if /i "!fileContent!"=="false" (
        echo Sto annullando...
        goto MENU
    ) else (
        echo Il file contiene un valore diverso da "true" o "false".
        pause
        goto MENU
    )
)
