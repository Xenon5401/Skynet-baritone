# SkyNet

SkyNet est un panneau de contrôle pour bots Minecraft, permettant de lancer, gérer et contrôler plusieurs instances Minecraft via une interface graphique moderne et un serveur WebSocket intégré. Merci d ètre indulgent ceci est mon premier gros projet avec electron.

## Fonctionnalités

- **Lancement multi-instance** : Lancez plusieurs instances Minecraft avec des comptes différents, automatiquement gérés.
- **Contrôle centralisé** : Envoyez des commandes à toutes les instances via WebSocket (ex : commandes Baritone, connexion à un serveur, gestion des amis).
- **Gestion des joueurs** : Ajoutez des amis, gérez les équipes et les utilisateurs via une interface dédiée.
- **Suivi des tâches** : Visualisez l'état des tâches en cours (minage, navigation, etc.).
- **Interface moderne** : Application Electron avec navigation intuitive et design responsive.

## Installation

1. **Prérequis** :
   - [Node.js](https://nodejs.org/)
   - [UltimMC](https://github.com/UltimMC/Launcher) installé et configuré (pour lancer les instances Minecraft)
   - Les fichiers d'instances et `accounts.json` doivent être présents dans le dossier `UltimMC`.

2. **Installation des dépendances** :
   ```bash
   npm install
   ```

3. **Lancement de l'application** :
   ```bash
   npm start
   ```

## Utilisation

- **Lancer des instances** : Depuis l'onglet principal, choisissez le nombre d'instances, la version, et (optionnellement) le nom d'utilisateur. Cliquez sur "Lancer les instances".
- **Gérer les paramètres** : Configurez le serveur cible, les options de jeu, etc. dans l'onglet "Setting".
- **Envoyer des commandes** : Utilisez l'onglet "Manageur" pour envoyer des commandes personnalisées à toutes les instances.
- **Gérer les joueurs** : Ajoutez des amis ou gérez les équipes dans l'onglet "Player".

## Structure du projet

- `main.js` : Point d'entrée Electron, gestion des fenêtres et de la logique principale.
- `websocket.js` : Serveur WebSocket pour le contrôle en temps réel.
- `render.js` : Logique de l'interface principale.
- `status.js`, `player.js`, `setting.js`, `manageur.js` : Modules pour chaque fonctionnalité de l'interface.
- `HtmlCss/` : Fichiers HTML/CSS de l'interface.
- `player.txt` : Liste des noms d'utilisateurs disponibles pour les instances.

## Dépendances principales

- [Electron](https://www.electronjs.org/)
- [ws](https://www.npmjs.com/package/ws)
- [fs-extra](https://www.npmjs.com/package/fs-extra)

## Auteurs

- Projet initial par Xenon5401

## Credit

- [UltimMC] (https://github.com/UltimMC)
- [meteor-client] (https://github.com/MeteorDevelopment)

## Licence

Ce projet est sous licence ISC.
