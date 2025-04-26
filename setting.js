const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('connection').addEventListener('click', () => {
        const serveur = document.getElementById('serveur').value;
        const command = String(`connect ${serveur}`);
        ipcRenderer.invoke('broadcast-command', command)
                .then(() => {
                    console.log(`Commande envoyée: ${command}`);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la commande:', error);
                });
    });

});