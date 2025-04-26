const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron/main')
const { spawn } = require('child_process')
const path = require('path')
const WebSocket = require('ws')
const fs = require('fs-extra');
const { initWebSocketServer,broadcastCommand,closeWebSocketServer } = require('./websocket')
const { electron } = require('process')



// Variable pour stocker la référence au serveur WebSocket
let wss = null

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      scrollBars: false
    }
  })

  mainWindow.loadFile('HtmlCss/index.html')
  mainWindow.setMenuBarVisibility(false)
}

// Fonction pour vérifier et copier l'instance si nécessaire
async function prepareInstance(baseInstanceName, instanceNumber) {
  const instancesPath = path.join("UltimMC", "instances")
  const targetInstancePath = path.join(instancesPath, `${baseInstanceName}_${instanceNumber}`)
  
  // Si c'est la première instance, on ne fait rien car c'est l'instance de base
  if (instanceNumber === 1) {
    console.log(`Instance ${instanceNumber} est l'instance de base, pas besoin de la copier`)
    return true
  }

  // Si l'instance cible existe déjà, on la laisse telle quelle
  if (fs.existsSync(targetInstancePath)) {
    console.log(`Instance ${instanceNumber} existe déjà, pas besoin de la copier`)
    return true
  }

  // Chercher l'instance précédente disponible
  let sourceInstanceNumber = instanceNumber - 1
  let sourceInstancePath
  
  while (sourceInstanceNumber >= 1) {
    sourceInstancePath = path.join(instancesPath, `${baseInstanceName}_${sourceInstanceNumber}`)
    if (fs.existsSync(sourceInstancePath)) {
      break
    }
    sourceInstanceNumber--
  }

  if (sourceInstanceNumber < 1) {
    console.error('Aucune instance source trouvée')
    return false
  }

  try {
    console.log(`Copie de l'instance ${sourceInstanceNumber} vers ${instanceNumber}`)
    await fs.copy(sourceInstancePath, targetInstancePath)
    return true
  } catch (error) {
    console.error('Erreur lors de la copie de l\'instance:', error)
    return false
  }
}

// Fonction pour lire les comptes depuis accounts.json
async function getAccounts() {
  try {
    const accountsPath = path.join("UltimMC", "accounts.json")
    const content = await fs.readFile(accountsPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Erreur lors de la lecture de accounts.json:', error)
    return { accounts: [], formatVersion: 3 }
  }
}

// Fonction pour sauvegarder les comptes dans accounts.json
async function saveAccounts(accounts) {
  try {
    const accountsPath = path.join("UltimMC", "accounts.json")
    await fs.writeFile(accountsPath, JSON.stringify(accounts, null, 4))
    return true
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de accounts.json:', error)
    return false
  }
}

// Fonction pour lire les noms d'utilisateurs depuis player.txt
async function getPlayerNames() {
  try {
    const content = await fs.readFile('player.txt', 'utf8')
    return content.split('\n')
      .map(line => line.trim().replace(/\r/g, '')) // Supprime les retours chariot et les espaces
      .filter(line => line !== '') // Filtre les lignes vides
  } catch (error) {
    console.error('Erreur lors de la lecture de player.txt:', error)
    return []
  }
}

// Fonction pour nettoyer un nom d'utilisateur
function cleanUsername(username) {
  return username.trim().replace(/\r/g, '')
}

// Fonction pour vérifier si un compte existe et le créer si nécessaire
async function ensureAccountExists(username) {
  const accounts = await getAccounts()
  const cleanedUsername = username.trim().replace(/\r/g, '')
  
  // Vérifier si le compte existe déjà
  const existingAccount = accounts.accounts.find(acc => acc.ygg?.extra?.userName === cleanedUsername)
  if (existingAccount) {
    return true
  }

  // Créer un nouveau compte
  const newAccount = {
    type: "dummy",
    ygg: {
      extra: {
        clientToken: Math.random().toString(36).substring(2, 34),
        userName: cleanedUsername
      },
      iat: Math.floor(Date.now() / 1000),
      token: cleanedUsername
    }
  }

  accounts.accounts.push(newAccount)
  return await saveAccounts(accounts)
}

// Fonction pour lancer Minecraft
async function launchMinecraft(username = '', instanceName = '') {
  const minecraftPath = path.join("UltimMC", "UltimMC.exe")
  
  console.log(`Tentative de lancement de Minecraft pour l'instance ${instanceName} avec l'utilisateur ${username}`)
  
  // Extraire le numéro d'instance
  const instanceMatch = instanceName.match(/_(\d+)$/)
  if (instanceMatch) {
    const instanceNumber = parseInt(instanceMatch[1])
    const baseInstanceName = instanceName.substring(0, instanceName.length - instanceMatch[0].length)
    
    console.log(`Préparation de l'instance ${instanceNumber} (base: ${baseInstanceName})`)
    
    // Vérifier si l'instance de base existe
    const baseInstancePath = path.join("UltimMC", "instances", `${baseInstanceName}_1`)
    if (!fs.existsSync(baseInstancePath)) {
      console.error(`L'instance de base ${baseInstanceName}_1 n'existe pas. Veuillez la créer manuellement dans UltimMC.`)
      return false
    }
    
    // Préparer l'instance si nécessaire
    const instanceReady = await prepareInstance(baseInstanceName, instanceNumber)
    if (!instanceReady) {
      console.error(`Échec de la préparation de l'instance ${instanceName}`)
      return false
    }
  }
  
  // S'assurer que le compte existe
  if (username) {
    const accountExists = await ensureAccountExists(username)
    if (!accountExists) {
      console.error('Impossible de créer le compte pour:', username)
      return false
    }
  }
  
  // Préparation des arguments pour UltimMC
  const args = []
  
  if (instanceName) {
    args.push('--launch')
    args.push(instanceName)
  }
  
  if (username) {
    args.push('--offline')
    args.push('-n')
    args.push(username)
  }

  if (username) {
    args.push('-a')
    args.push(username);
  }
  
  try {
    console.log(`Lancement de Minecraft avec les arguments: ${args.join(' ')}`)
    const minecraft = spawn(minecraftPath, args, {
      detached: true,
      stdio: 'ignore',
      shell: true,
      windowsHide: false
    })
    
    minecraft.on('error', (error) => {
      console.error('Erreur lors du lancement du processus:', error)
    })
    
    minecraft.unref()
    console.log(`Processus Minecraft lancé avec succès pour l'instance ${instanceName}`)
    
    // Envoyer une notification à tous les clients WebSocket connectés
    if (clients) {
      const notification = {
        type: 'minecraft-launched',
        username,
        instanceName,
        timestamp: new Date().toISOString()
      };
      
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(notification));
        }
      });
    }
    
    return true
  } catch (error) {
    console.error('Erreur lors du lancement de Minecraft:', error)
    return false
  }
}

// Configuration de l'IPC
ipcMain.handle('launch-minecraft', async (event, username, instanceName) => {
  return launchMinecraft(username, instanceName)
})

ipcMain.handle('get-player-names', async () => {
  return getPlayerNames()
})

// Ajout des nouveaux gestionnaires IPC pour le serveur WebSocket
ipcMain.handle('start-websocket-server', async (event, port) => {
  return initWebSocketServer(port)
})

ipcMain.handle('stop-websocket-server', async () => {
  closeWebSocketServer()
  return true
})

ipcMain.handle('send-websocket-message', async (event, message) => {
  if (clients) {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
    return true
  }
  return false
})

// Ajout du gestionnaire IPC pour la diffusion de commandes
ipcMain.handle('broadcast-command', async (event, command) => {
    broadcastCommand(command);
    console.log(command)
    return true;
});

app.whenReady().then(() => {
  createWindow()
  
  // Démarrer automatiquement le serveur WebSocket sur le port 8080
  initWebSocketServer(4242)
})

app.on('window-all-closed', () => {
  closeWebSocketServer()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('quit', () => {
  closeWebSocketServer()
})