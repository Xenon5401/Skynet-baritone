const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('friendadd').addEventListener('click', () => {
        const friend = document.getElementById('friend').value;
        const command = String(`.friends add ${friend}`);
        ipcRenderer.invoke('broadcast-command', command)
                .then(() => {
                    console.log(`Commande envoyée: ${command}`);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la commande:', error);
                });
    });

});