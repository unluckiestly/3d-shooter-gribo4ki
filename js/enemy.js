class Enemy {
    constructor(scene, position = null) {
        this.scene = scene;
        this.mesh = this.createMushroomMesh();
        this.setRandomPosition(position);
        this.scene.add(this.mesh);
    }
    
    createMushroomMesh() {
        // Создаем группу для гриба
        const mushroomGroup = new THREE.Group();
        
        // Ножка гриба (цилиндр)
        const stemGeometry = new THREE.CylinderGeometry(
            0.2,  // радиус верха
            0.25, // радиус низа (чуть шире)
            1.5,  // высота
            12    // сегменты
        );
        const stemMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xf5deb3 // бежевый цвет ножки
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.75; // поднимаем ножку от земли
        stem.castShadow = false;
        mushroomGroup.add(stem);
        
        // Шляпка гриба (полусфера)
        const capGeometry = new THREE.SphereGeometry(
            0.8,  // радиус
            16,   // сегменты по ширине
            8,    // сегменты по высоте
            0,    // начальный угол phi
            Math.PI * 2, // длина phi
            0,    // начальный угол theta
            Math.PI * 0.6 // длина theta (полусфера)
        );
        const capMaterial = new THREE.MeshLambertMaterial({ 
            color: CONFIG.COLORS.ENEMY // красный цвет шляпки
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 1.4; // размещаем шляпку на верху ножки
        cap.castShadow = true;
        mushroomGroup.add(cap);
    
        
        return mushroomGroup;
    }
    
    setRandomPosition(position = null) {
        if (position) {
            this.mesh.position.copy(position);
        } else {
            this.mesh.position.x = Math.random() * 40 - 20;
            this.mesh.position.y = 0; // грибы стоят на земле
            this.mesh.position.z = Math.random() * 40 - 20;
        }
    }
    
    moveTowardsPlayer(playerPosition) {
        const direction = new THREE.Vector3();
        direction.subVectors(playerPosition, this.mesh.position);
        direction.normalize();
        direction.multiplyScalar(CONFIG.ENEMY_SPEED);
        
        // Движемся только по X и Z, не по Y
        direction.y = 0;
        this.mesh.position.add(direction);
        
       // Правильный поворот к игроку без переворачивания
        const targetRotation = Math.atan2(direction.x, direction.z);
        this.mesh.rotation.y = targetRotation;
    }
    
    getPosition() {
        return this.mesh.position;
    }
    
    destroy() {
        this.scene.remove(this.mesh);
    }
    
    update(playerPosition) {
        this.moveTowardsPlayer(playerPosition);
        
        // ИСПРАВЛЕНИЕ: Принудительно фиксируем Y позицию чтобы грибы не уходили под пол
        this.mesh.position.y = 0;
        
        // Добавляем легкое покачивание для живости
        this.mesh.rotation.z = Math.sin(Date.now() * 0.001 + this.mesh.position.x) * 0.05;
    }
}

class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.createInitialEnemies();
    }
    
    createInitialEnemies() {
        for (let i = 0; i < CONFIG.ENEMY_COUNT; i++) {
            this.enemies.push(new Enemy(this.scene));
        }
    }
    
    spawnNewEnemy() {
        // Создаём врага за пределами видимости
        const angle = Math.random() * Math.PI * 2;
        const distance = CONFIG.ENEMY_SPAWN_DISTANCE;
        const position = new THREE.Vector3(
            Math.cos(angle) * distance,
            0, // грибы на уровне земли
            Math.sin(angle) * distance
        );
        
        this.enemies.push(new Enemy(this.scene, position));
    }
    
    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        console.log('Removing enemy, index:', index, 'total enemies:', this.enemies.length); // Отладка
        
        if (index > -1) {
            enemy.destroy();
            this.enemies.splice(index, 1);
            console.log('Enemy removed, remaining:', this.enemies.length); // Отладка
        } else {
            console.log('Enemy not found in array!'); // Отладка
        }
    }
    
    getEnemies() {
        return this.enemies;
    }
    
    update(playerPosition) {
        this.enemies.forEach(enemy => {
            enemy.update(playerPosition);
        });
    }
}