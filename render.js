const { ipcRenderer } = require('electron')

async function lancerMinecraft() {
    const username = document.getElementById('minecraft-username').value
    const baseInstanceName = document.getElementById('instance-name').value
    const nombreInstances = parseInt(document.getElementById('manual-input').value)
    
    if (!baseInstanceName) {
        alert('Veuillez entrer un nom d\'instance de base')
        return
    }

    try {
        // Récupérer la liste des noms d'utilisateurs si le champ est vide
        let playerNames = []
        if (!username) {
            playerNames = await ipcRenderer.invoke('get-player-names')
            if (playerNames.length === 0) {
                alert('Aucun nom d\'utilisateur trouvé dans player.txt')
                return
            }
            if (playerNames.length < nombreInstances) {
                alert(`Il n'y a que ${playerNames.length} noms d'utilisateurs disponibles dans player.txt`)
                return
            }
        }

        console.log(`Début du lancement de ${nombreInstances} instances`)
        
        // Créer un tableau de promesses pour lancer toutes les instances en parallèle
        const lancements = []
        
        for(let i = 1; i <= nombreInstances; i++) {
            const instanceName = `${baseInstanceName}_${i}`
            const currentUsername = username || playerNames[i - 1]
            console.log(`Préparation du lancement de l'instance ${instanceName} pour ${currentUsername}`)
            
            // Ajouter la promesse de lancement au tableau
            lancements.push(
                new Promise(async (resolve) => {
                    await new Promise(resolveDelay => setTimeout(resolveDelay, 2000)); // Délai de 1 seconde
                    const resultat = await ipcRenderer.invoke('launch-minecraft', currentUsername, instanceName);
                    if (resultat) {
                        console.log(`Instance ${instanceName} lancée avec succès pour ${currentUsername}`);
                    } else {
                        console.error(`Échec du lancement de l'instance ${instanceName}`);
                    }
                    resolve();
                })
            );
        }
        
        // Lancer toutes les instances en parallèle
        await Promise.all(lancements)
        console.log('Toutes les instances ont été lancées')
    } catch (error) {
        console.error('Erreur lors de la tentative de lancement de Minecraft:', error)
    }
}


module.exports = { lancerMinecraft }

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const manualInput = document.getElementById('manual-input');

    if (slider && manualInput) {
        // Définir une valeur minimale de 1
        slider.min = 1;
        manualInput.min = 1;
        // Définir une valeur maximale raisonnable
        slider.max = 10;
        manualInput.max = 10;
        // Définir la valeur par défaut
        slider.value = 1;
        manualInput.value = 1;

        slider.addEventListener('input', (e) => {
            manualInput.value = e.target.value;
        });

        manualInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= 10) {
                slider.value = value;
            }
        });
    }
    
    document.getElementById('boutonMinecraft').addEventListener('click', () => {
        lancerMinecraft();
    }); 
});