class Bullet {
    constructor(scene, position, direction) {
        this.scene = scene;
        this.mesh = this.createMesh();
        this.velocity = direction.multiplyScalar(CONFIG.BULLET_SPEED);
        this.mesh.position.copy(position);
        this.scene.add(this.mesh);
        
        // Автоматическое удаление через время
        this.lifetime = CONFIG.BULLET_LIFETIME;
        this.age = 0;
    }
    
    createMesh() {
        const geometry = new THREE.SphereGeometry(CONFIG.BULLET_SIZE);
        const material = new THREE.MeshBasicMaterial({ 
            color: CONFIG.COLORS.BULLET 
        });
        return new THREE.Mesh(geometry, material);
    }
    
    update(deltaTime) {
        this.mesh.position.add(this.velocity);
        this.age += deltaTime;
        return this.age < this.lifetime;
    }
    
    getPosition() {
        return this.mesh.position;
    }
    
    destroy() {
        this.scene.remove(this.mesh);
    }
    
    checkCollision(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            
            // Используем улучшенную проверку коллизий
            if (enemy.checkCollisionWithBullet && enemy.checkCollisionWithBullet(this.getPosition())) {
                console.log('Hit detected with mushroom!'); // Отладка
                return enemy;
            }
            
            // Fallback к старому методу если новый не доступен
            const distance = this.getPosition().distanceTo(enemy.getPosition());
            if (distance < CONFIG.HIT_DISTANCE) {
                console.log('Hit detected!', distance); // Отладка
                return enemy;
            }
        }
        return null;
    }
}

class BulletManager {
    constructor(scene) {
        this.scene = scene;
        this.bullets = [];
    }
    
    createBullet(position, direction) {
        const bullet = new Bullet(this.scene, position.clone(), direction.clone());
        this.bullets.push(bullet);
        return bullet;
    }
    
    removeBullet(bullet) {
        const index = this.bullets.indexOf(bullet);
        if (index > -1) {
            bullet.destroy();
            this.bullets.splice(index, 1);
        }
    }
    
    update(deltaTime, enemies) {
        const bulletsToRemove = [];
        const hitEnemies = [];
        
        this.bullets.forEach(bullet => {
            // Обновляем пулю
            const isAlive = bullet.update(deltaTime);
            
            if (!isAlive) {
                bulletsToRemove.push(bullet);
                return;
            }
            
            // Проверяем коллизии с врагами
            const hitEnemy = bullet.checkCollision(enemies);
            if (hitEnemy) {
                bulletsToRemove.push(bullet);
                hitEnemies.push(hitEnemy);
            }
        });
        
        // Удаляем отжившие пули
        bulletsToRemove.forEach(bullet => {
            this.removeBullet(bullet);
        });
        
        // Возвращаем попадания
        return hitEnemies.length > 0 ? hitEnemies : null;
    }
    
    getBullets() {
        return this.bullets;
    }
}