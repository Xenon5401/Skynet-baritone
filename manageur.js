const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('run').addEventListener('click', () => {
        const command = document.getElementById('command').value;
        console.log(`Commande saisie: ${command}`);
        if (command) {
            // Appeler la fonction pour envoyer la commande à tous les clients
            alert
            ipcRenderer.invoke('broadcast-command', command)
                .then(() => {
                    console.log(`Commande envoyée: ${command}`);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la commande:', error);
                });
        } else {
            alert('Veuillez entrer une commande.');
        }
    });
    // Gestionnaire d'événements pour les lignes du tableau

    const rows = document.querySelectorAll('#instancesTable tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const command = row.getAttribute('data-command');
            if (command) {
                ipcRenderer.invoke('broadcast-command', command)
                .then(() => {
                    console.log(`Commande envoyée: ${command}`);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la commande:', error);
                });
            }
        });
    });
    
});