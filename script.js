
document.addEventListener('DOMContentLoaded', () => {
    const previewContainer = document.querySelector('.character-preview');
    const categoriesContainer = document.querySelector('.categories-list');
    const itemsGrid = document.querySelector('.items-grid');
    
    let inventory = null;
    let currentState = {};
    const layers = {}; // To keep track of img elements for each category

    // Initialize the game
    async function init() {
        try {
            const response = await fetch('assets/inventory.json');
            inventory = await response.json();
            
            setupCategories();
            setupInitialState();
            preloadImages();
        } catch (error) {
            console.error('Failed to load inventory:', error);
        }
    }

    // Setup category tabs
    function setupCategories() {
        categoriesContainer.innerHTML = '';
        inventory.categories.forEach((category, index) => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${index === 0 ? 'active' : ''}`;
            btn.textContent = category.name;
            btn.dataset.categoryId = category.id;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderItems(category.id);
            });
            
            categoriesContainer.appendChild(btn);
        });

        // Render first category items by default
        if (inventory.categories.length > 0) {
            renderItems(inventory.categories[0].id);
        }
    }

    // Setup initial character state (first item of each required category)
    function setupInitialState() {
        inventory.categories.forEach(category => {
            const firstItem = category.items[0];
            if (firstItem) {
                updateLayer(category.id, firstItem);
            }
        });
    }

    // Render items for a selected category
    function renderItems(categoryId) {
        itemsGrid.innerHTML = '';
        const category = inventory.categories.find(c => c.id === categoryId);
        
        category.items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = `item-card ${currentState[categoryId]?.id === item.id ? 'active' : ''}`;
            
            // Thumbnail or small version
            const img = document.createElement('img');
            img.src = item.path;
            img.alt = item.name;
            
            const nameLabel = document.createElement('span');
            nameLabel.textContent = item.name;
            
            itemCard.appendChild(img);
            itemCard.appendChild(nameLabel);
            
            itemCard.addEventListener('click', () => {
                // Update UI selection
                document.querySelectorAll('.item-card').forEach(c => c.classList.remove('active'));
                itemCard.classList.add('active');
                
                // Update character
                updateLayer(categoryId, item);
            });
            
            itemsGrid.appendChild(itemCard);
        });
    }

    // Update the visual layer for a category
    function updateLayer(categoryId, item) {
        currentState[categoryId] = item;
        const category = inventory.categories.find(c => c.id === categoryId);
        
        if (!layers[categoryId]) {
            const img = document.createElement('img');
            img.className = 'layer';
            img.style.zIndex = category.layerIndex;
            previewContainer.appendChild(img);
            layers[categoryId] = img;
        }
        
        // Soft transition effect
        layers[categoryId].style.opacity = '0';
        
        // Wait for next frame to change src and fade back in
        setTimeout(() => {
            layers[categoryId].src = item.path;
            layers[categoryId].onload = () => {
                layers[categoryId].style.opacity = '1';
            };
        }, 50);
    }

    // Basic preloading to prevent flickering
    function preloadImages() {
        inventory.categories.forEach(cat => {
            cat.items.forEach(item => {
                const img = new Image();
                img.src = item.path;
            });
        });
    }

    init();
});
