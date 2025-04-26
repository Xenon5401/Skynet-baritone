const WebSocket = require('ws');
const fs = require('fs-extra');
const path = require('path');

// Variable pour stocker les clients connectés
const clients = [];

// Fonction pour initialiser le serveur WebSocket
function initWebSocketServer(port = 6666) {
  try {
    const wss = new WebSocket.Server({ port });

    console.log(`Serveur WebSocket démarré sur le port ${port}`);

    // Ajout de la fonction broadcast
    function broadcast(data) {
      const message = JSON.stringify(data);
      clients.forEach(client => {
        client.send(message);
      });
    }

    // Gérer les nouvelles connexions
    wss.on('connection', (ws) => {
      clients.push(ws);  // Ajouter le client à la liste
      console.log('Nouvelle connexion WebSocket établie. Nombre de clients connectés:', clients.length);

      // Envoyer un message de bienvenue au client
      ws.send(JSON.stringify({
        type: 'info',
        message: 'Connecté au serveur WebSocket de l\'application Minecraft'
      }));

      // Gérer les messages entrants
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          console.log('Message WebSocket reçu:', data);

          // Si c'est la commande destinée à l'instance, on la diffuse à tous les clients
          if (data.command === 'commandePourInstance') {
            broadcast({
              type: 'commande-instance',
              payload: data.payload,
              sender: data.sender 
            });
            return;
          }

          // Traitement des autres commandes…
          switch (data.command) {
            case 'launch':
              const result = await launchMinecraft(data.username, data.instanceName);
              broadcast({
                type: 'launch-result',
                success: result,
                username: data.username,
                instanceName: data.instanceName
              });
              break;

            case 'getPlayers':
              const players = await getPlayerNames();
              broadcast({
                type: 'players',
                players
              });
              break;

            default:
              // En cas de commande inconnue, renvoyer l'erreur à l'envoyeur
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Commande inconnue'
              }));
          }
        } catch (error) {
          console.error('Erreur lors du traitement du message WebSocket:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Erreur lors du traitement de la demande'
          }));
        }
      });

      // Gérer la déconnexion d'un client
      ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index !== -1) {
          clients.splice(index, 1);  // Retirer le client de la liste
          console.log('Connexion WebSocket fermée');
        }
      });

      // Gérer les erreurs WebSocket
      ws.on('error', (error) => {
        console.error('Erreur WebSocket:', error);
      });
    });

    // Gérer les erreurs du serveur WebSocket
    wss.on('error', (error) => {
      console.error('Erreur du serveur WebSocket:', error);
    });

    return wss; // Retourner l'instance du serveur WebSocket
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du serveur WebSocket:', error);
    return null;
  }
}

// Fonction pour envoyer une commande à un client spécifique
function sendCommandToClient(clientId, command) {
  const client = clients[clientId];
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({
      type: 'command',
      command: command
    }));
    console.log(`Commande envoyée au client ${clientId}: ${command}`);
  } else {
    console.error(`Client ${clientId} non trouvé ou déconnecté`);
  }
}

// Fonction pour envoyer une commande à tous les clients
function broadcastCommand(command) {
  const message = JSON.stringify({
    type: 'command',
    command: command
  });
  console.log(`Diffusion de la commande: ${command}`);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Fonction pour fermer le serveur WebSocket
function closeWebSocketServer(wss) {
  if (wss) {
    wss.close((error) => {
      if (error) {
        console.error('Erreur lors de la fermeture du serveur WebSocket:', error);
      } else {
        console.log('Serveur WebSocket fermé avec succès.');
      }
    });
  } else {
    console.error('Aucune instance de serveur WebSocket à fermer.');
  }
}

// Exporter les fonctions nécessaires
module.exports = {
  initWebSocketServer,
  sendCommandToClient, // Exporter la fonction pour un client spécifique
  broadcastCommand,// Exporter la nouvelle fonction pour tous les clients
  closeWebSocketServer
}
