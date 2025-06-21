class Player {
    constructor(camera) {
        this.camera = camera;
        this.yaw = 0;      // Поворот по горизонтали
        this.pitch = 0;    // Поворот по вертикали
        this.keys = {};
        
        // Система здоровья
        this.health = CONFIG.PLAYER_MAX_HEALTH;
        this.maxHealth = CONFIG.PLAYER_MAX_HEALTH;
        this.lastDamageTime = 0;
        this.isDead = false;
        
        // Векторы для движения
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.up = new THREE.Vector3(0, 1, 0);
    }
    
    setPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
    
    takeDamage(damage) {
        const currentTime = Date.now();
        
        // Проверяем кулдаун урона
        if (currentTime - this.lastDamageTime < CONFIG.PLAYER_DAMAGE_COOLDOWN) {
            return false; // Урон не прошел из-за кулдауна
        }
        
        this.health -= damage;
        this.lastDamageTime = currentTime;
        
        // Проверяем смерть
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
        
        console.log(`Игрок получил урон: ${damage}. Здоровье: ${this.health}/${this.maxHealth}`);
        return true; // Урон прошел успешно
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    getHealth() {
        return this.health;
    }
    
    getMaxHealth() {
        return this.maxHealth;
    }
    
    isDamageReady() {
        const currentTime = Date.now();
        return currentTime - this.lastDamageTime >= CONFIG.PLAYER_DAMAGE_COOLDOWN;
    }
    
    checkCollisionWithEnemies(enemies) {
        if (this.isDead || !this.isDamageReady()) {
            return null;
        }
        
        const playerPosition = this.getPosition();
        
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const enemyPosition = enemy.getPosition();
            const distance = playerPosition.distanceTo(enemyPosition);
            
            if (distance < CONFIG.ENEMY_COLLISION_DISTANCE) {
                return enemy;
            }
        }
        
        return null;
    }
    
    updateMovement() {
        if (this.isDead) return; // Мертвый игрок не может двигаться
        
        const speed = CONFIG.PLAYER_SPEED;
        const velocity = new THREE.Vector3();
        
        // Обновляем векторы направления
        this.updateDirectionVectors();
        
        // Рассчитываем движение
        if (this.keys['KeyS']) velocity.add(this.forward.clone().multiplyScalar(speed));
        if (this.keys['KeyW']) velocity.add(this.forward.clone().multiplyScalar(-speed));
        if (this.keys['KeyD']) velocity.add(this.right.clone().multiplyScalar(-speed));
        if (this.keys['KeyA']) velocity.add(this.right.clone().multiplyScalar(speed));
        
        // Применяем движение (убираем Y компонент для движения только по земле)
        velocity.y = 0;
        this.camera.position.add(velocity);
    }
    
    updateDirectionVectors() {
        // Передний вектор
        this.forward.set(
            Math.sin(this.yaw),
            0,
            Math.cos(this.yaw)
        ).normalize();
        
        // Правый вектор
        this.right.crossVectors(this.forward, this.up).normalize();
    }
    
    updateRotation() {
        // Применяем поворот к камере
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
        this.camera.rotation.z = 0;
    }
    
    handleMouseMove(movementX, movementY) {
        if (this.isDead) return; // Мертвый игрок не может поворачиваться
        
        this.yaw -= movementX * CONFIG.MOUSE_SENSITIVITY;
        this.pitch -= movementY * CONFIG.MOUSE_SENSITIVITY;
        
        // Ограничиваем поворот по вертикали
        this.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pitch));
    }
    
    handleKeyDown(code) {
        if (this.isDead) return; // Мертвый игрок не может использовать клавиши
        this.keys[code] = true;
    }
    
    handleKeyUp(code) {
        if (this.isDead) return;
        this.keys[code] = false;
    }
    
    getPosition() {
        return this.camera.position;
    }
    
    getDirection() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        return direction;
    }
    
    update() {
        this.updateMovement();
        this.updateRotation();
    }
}