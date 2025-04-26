const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // Fonction de connexion existante
    document.getElementById('minage').addEventListener('click', () => {
        const option = selectedItems.map(item => item.id).join(' ');
        const command = String(`.baritone mine ${option}`);
        ipcRenderer.invoke('broadcast-command', command)
                .then(() => {
                    console.log(`Commande envoyée: ${command}`);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la commande:', error);
                });
    });

    // Liste des blocs et items Minecraft avec leurs classes CSS d'icônes
    const minecraftItems = [
        { id: "minecraft:stone", nom: "Pierre", categorie: "Bloc de construction", icon: "icon-minecraft-stone" },
        { id: "minecraft:granite", nom: "Granite", categorie: "Bloc de construction", icon: "icon-minecraft-stone" },
        { id: "minecraft:diorite", nom: "Diorite", categorie: "Bloc de construction", icon: "icon-minecraft-stone" },
        { id: "minecraft:andesite", nom: "Andésite", categorie: "Bloc de construction", icon: "icon-minecraft-stone" },
        { id: "minecraft:grass_block", nom: "Bloc d'herbe", categorie: "Bloc naturel", icon: "icon-minecraft-grass" },
        { id: "minecraft:dirt", nom: "Terre", categorie: "Bloc naturel", icon: "icon-minecraft-dirt" },
        { id: "minecraft:coarse_dirt", nom: "Terre stérile", categorie: "Bloc naturel", icon: "icon-minecraft-dirt" },
        { id: "minecraft:podzol", nom: "Podzol", categorie: "Bloc naturel", icon: "icon-minecraft-dirt" },
        { id: "minecraft:cobblestone", nom: "Pierre taillée", categorie: "Bloc de construction", icon: "icon-minecraft-cobblestone" },
        { id: "minecraft:oak_planks", nom: "Planches de chêne", categorie: "Bloc de construction", icon: "icon-minecraft-oak-planks" },
        { id: "minecraft:spruce_planks", nom: "Planches de sapin", categorie: "Bloc de construction", icon: "icon-minecraft-spruce-planks" },
        { id: "minecraft:birch_planks", nom: "Planches de bouleau", categorie: "Bloc de construction", icon: "icon-minecraft-birch-planks" },
        { id: "minecraft:jungle_planks", nom: "Planches d'acajou", categorie: "Bloc de construction", icon: "icon-minecraft-jungle-planks" },
        { id: "minecraft:acacia_planks", nom: "Planches d'acacia", categorie: "Bloc de construction", icon: "icon-minecraft-acacia-planks" },
        { id: "minecraft:dark_oak_planks", nom: "Planches de chêne noir", categorie: "Bloc de construction", icon: "icon-minecraft-dark-oak-planks" },
        { id: "minecraft:sand", nom: "Sable", categorie: "Bloc naturel", icon: "icon-minecraft-sand" },
        { id: "minecraft:red_sand", nom: "Sable rouge", categorie: "Bloc naturel", icon: "icon-minecraft-red-sand" },
        { id: "minecraft:gravel", nom: "Gravier", categorie: "Bloc naturel", icon: "icon-minecraft-gravel" },
        { id: "minecraft:gold_ore", nom: "Minerai d'or", categorie: "Minerai", icon: "icon-minecraft-gold-ore" },
        { id: "minecraft:iron_ore", nom: "Minerai de fer", categorie: "Minerai", icon: "icon-minecraft-iron-ore" },
        { id: "minecraft:coal_ore", nom: "Minerai de charbon", categorie: "Minerai", icon: "icon-minecraft-coal-ore" },
        { id: "minecraft:oak_log", nom: "Bûche de chêne", categorie: "Bloc naturel", icon: "icon-minecraft-oak-log" },
        { id: "minecraft:spruce_log", nom: "Bûche de sapin", categorie: "Bloc naturel", icon: "icon-minecraft-spruce-log" },
        { id: "minecraft:birch_log", nom: "Bûche de bouleau", categorie: "Bloc naturel", icon: "icon-minecraft-birch-log" },
        { id: "minecraft:jungle_log", nom: "Bûche d'acajou", categorie: "Bloc naturel", icon: "icon-minecraft-jungle-log" },
        { id: "minecraft:acacia_log", nom: "Bûche d'acacia", categorie: "Bloc naturel", icon: "icon-minecraft-acacia-log" },
        { id: "minecraft:dark_oak_log", nom: "Bûche de chêne noir", categorie: "Bloc naturel", icon: "icon-minecraft-dark-oak-log" },
        { id: "minecraft:obsidian", nom: "Obsidienne", categorie: "Bloc de construction", icon: "icon-minecraft-obsidian" },
        { id: "minecraft:diamond_ore", nom: "Minerai de diamant", categorie: "Minerai", icon: "icon-minecraft-diamond-ore" },
        { id: "minecraft:redstone_ore", nom: "Minerai de redstone", categorie: "Minerai", icon: "icon-minecraft-redstone-ore" },
        { id: "minecraft:snow", nom: "Neige", categorie: "Bloc naturel", icon: "icon-minecraft-snow" },
        { id: "minecraft:ice", nom: "Glace", categorie: "Bloc naturel", icon: "icon-minecraft-ice" },
        { id: "minecraft:cactus", nom: "Cactus", categorie: "Bloc naturel", icon: "icon-minecraft-cactus" },
        { id: "minecraft:clay", nom: "Argile", categorie: "Bloc naturel", icon: "icon-minecraft-clay" },
        { id: "minecraft:pumpkin", nom: "Citrouille", categorie: "Bloc naturel", icon: "icon-minecraft-pumpkin" },
        { id: "minecraft:netherrack", nom: "Roche du Nether", categorie: "Bloc du Nether", icon: "icon-minecraft-netherrack" },
        { id: "minecraft:soul_sand", nom: "Sable des âmes", categorie: "Bloc du Nether", icon: "icon-minecraft-soul-sand" },
        { id: "minecraft:glowstone", nom: "Pierre lumineuse", categorie: "Bloc du Nether", icon: "icon-minecraft-glowstone" },
        { id: "minecraft:crafting_table", nom: "Établi", categorie: "Bloc fonctionnel", icon: "icon-minecraft-crafting-table" },
        { id: "minecraft:furnace", nom: "Fourneau", categorie: "Bloc fonctionnel", icon: "icon-minecraft-furnace" },
        { id: "minecraft:chest", nom: "Coffre", categorie: "Bloc fonctionnel", icon: "icon-minecraft-chest" },
        { id: "minecraft:end_stone", nom: "Pierre de l'End", categorie: "Bloc de l'End", icon: "icon-minecraft-end-stone" },
        { id: "minecraft:emerald_ore", nom: "Minerai d'émeraude", categorie: "Minerai", icon: "icon-minecraft-emerald-ore" },
        { id: "minecraft:quartz_ore", nom: "Minerai de quartz", categorie: "Minerai", icon: "icon-minecraft-nether-quartz-ore" },
        { id: "minecraft:terracotta", nom: "Terre cuite", categorie: "Bloc de construction", icon: "icon-minecraft-terracotta" },
        { id: "minecraft:hay_block", nom: "Bloc de foin", categorie: "Bloc de construction", icon: "icon-minecraft-hay-block" },
        { id: "minecraft:prismarine", nom: "Prismarine", categorie: "Bloc de construction", icon: "icon-minecraft-prismarine" },
        { id: "minecraft:sea_lantern", nom: "Lanterne marine", categorie: "Bloc lumineux", icon: "icon-minecraft-sea-lantern" },
        { id: "minecraft:slime_block", nom: "Bloc de slime", categorie: "Bloc fonctionnel", icon: "icon-minecraft-slime-block" },
    ];

    // Tableau pour stocker les items sélectionnés
    const selectedItems = [];

    // Remplir le tableau
    const tableBody = document.querySelector('#minecraftItems tbody');
    
    function renderTable(items) {
        tableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="icon-cell"><i class="icon-minecraft ${item.icon}"></i></td>
                <td>${item.id}</td>
                <td>${item.nom}</td>
                <td>${item.categorie}</td>
            `;
            
            row.addEventListener('click', () => {
                toggleItemSelection(item);
            });
            
            // Mettre en évidence les items déjà sélectionnés
            if (selectedItems.some(selected => selected.id === item.id)) {
                row.classList.add('selected');
                row.style.backgroundColor = '#bde5ff';
            }
            
            tableBody.appendChild(row);
        });
    }
    
    // Initialiser le tableau
    renderTable(minecraftItems);
    
    // Fonction pour la recherche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = minecraftItems.filter(item => 
            item.id.toLowerCase().includes(searchTerm) || 
            item.nom.toLowerCase().includes(searchTerm) || 
            item.categorie.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredItems);
    });
    
    // Fonction pour basculer la sélection d'un item
    function toggleItemSelection(item) {
        const index = selectedItems.findIndex(selected => selected.id === item.id);
        
        if (index === -1) {
            // Ajouter l'item
            selectedItems.push(item);
            console.log(`Item sélectionné: ${item.nom} (${item.id})`);
        } else {
            // Retirer l'item
            selectedItems.splice(index, 1);
            console.log(`Item désélectionné: ${item.nom} (${item.id})`);
        }
        
        // Mettre à jour l'affichage des items sélectionnés
        updateSelectedItemsDisplay();
        
        // Actualiser le tableau pour mettre à jour la visualisation des sélections
        renderTable(minecraftItems.filter(item => 
            item.id.toLowerCase().includes(searchInput.value.toLowerCase()) || 
            item.nom.toLowerCase().includes(searchInput.value.toLowerCase()) || 
            item.categorie.toLowerCase().includes(searchInput.value.toLowerCase())
        ));
        
    }
    
    // Fonction pour mettre à jour l'affichage des items sélectionnés
    function updateSelectedItemsDisplay() {
        const selectedItemsList = document.getElementById('selectedItemsList');
        
        if (selectedItems.length === 0) {
            selectedItemsList.innerHTML = '<p>Aucun item sélectionné</p>';
            return;
        }
        
        selectedItemsList.innerHTML = '';
        selectedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'selected-item';
            itemElement.innerHTML = `
                <i class="icon-minecraft ${item.icon}"></i>
                <span>${item.nom}</span>
            `;
            
            // Ajouter un bouton pour supprimer l'item de la sélection
            const removeButton = document.createElement('button');
            removeButton.innerText = '×';
            removeButton.style.marginLeft = '5px';
            removeButton.style.border = 'none';
            removeButton.style.background = 'none';
            removeButton.style.cursor = 'pointer';
            removeButton.style.color = 'red';
            removeButton.style.fontWeight = 'bold';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêcher la propagation de l'événement
                toggleItemSelection(item);
            });
            
            itemElement.appendChild(removeButton);
            selectedItemsList.appendChild(itemElement);
        });
    }
    
    // Initialiser l'affichage des items sélectionnés
    updateSelectedItemsDisplay();

    document.getElementById('go').addEventListener('click', () => {
        const goto = document.getElementById('goto').value;
        const command = String(`.baritone goto ${goto}`);
        ipcRenderer.invoke('broadcast-command', command)
                .then(() => {
                    console.log(`Commande envoyée: ${command}`);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi de la commande:', error);
                });
    });
});