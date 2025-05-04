# SkyNet

SkyNet est un panneau de contrôle pour bots Minecraft, permettant de lancer, gérer et contrôler plusieurs instances Minecraft via une interface graphique moderne et un serveur WebSocket intégré. Merci d'être indulgent, ceci est mon premier gros projet avec Electron.

![Interface principale](https://i.imgur.com/Okvbrr9.png)


## Fonctionnalités

- **Lancement multi-instance** : Lancez plusieurs instances Minecraft avec des comptes différents, automatiquement gérés.
- **Contrôle centralisé** : Envoyez des commandes à toutes les instances via WebSocket (ex : commandes Baritone, connexion à un serveur, gestion des amis).
- **Gestion des joueurs** : Ajoutez des amis, gérez les équipes et les utilisateurs via une interface dédiée.
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
3. **Verification de l installation du projet**
   
   voici à quoi un ls ou dir du projet devrait ressembler
   
   ```
   29/04/2025  08:35    <DIR>          asset
   17/03/2025  07:00            67 324 Gui.png
   29/04/2025  08:35    <DIR>          HtmlCss
   23/03/2025  11:04             8 911 main.js
   21/03/2025  13:24             1 498 manageur.js
   29/04/2025  08:35    <DIR>          node_modules
   26/04/2025  18:08            31 763 package-lock.json
   26/04/2025  18:08               385 package.json
   21/03/2025  20:01               636 player.js
   18/03/2025  08:35             1 586 player.txt
   26/04/2025  18:11             2 719 README.md
   20/03/2025  22:57             3 534 render.js
   21/03/2025  18:53               635 setting.js
   22/03/2025  22:22            11 860 status.js
   29/04/2025  09:12    <DIR>          UltimMC
   20/03/2025  22:11             5 089 websocket.js
   ```

5. **Lancement de l'application** :
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
