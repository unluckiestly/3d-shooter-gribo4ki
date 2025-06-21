class Game {
    constructor() {
        this.gameScene = null;
        this.player = null;
        this.enemyManager = null;
        this.bulletManager = null;
        this.controls = null;
        this.score = 0;
        this.lastTime = 0;
        this.gameOver = false;
        
        this.init();
    }
    
    init() {
        // Создаём сцену
        this.gameScene = new GameScene();
        
        // Создаём игрока
        this.player = new Player(this.gameScene.getCamera());
        
        // Создаём менеджеры
        this.enemyManager = new EnemyManager(this.gameScene.getScene());
        this.bulletManager = new BulletManager(this.gameScene.getScene());
        
        // Настраиваем управление
        this.controls = new GameControls(this.player, this);
        
        // Инициализируем UI
        this.updateHealthUI();
        
        // Запускаем игровой цикл
        this.animate();
        
        console.log('Игра запущена! Кликните для захвата мыши.');
    }
    
    shoot() {
        if (this.player.isDead || this.gameOver) return;
        
        const playerPosition = this.player.getPosition();
        const direction = this.player.getDirection();
        
        this.bulletManager.createBullet(playerPosition, direction);
    }
    
    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }
    
    updateHealthUI() {
        const healthElement = document.getElementById('health');
        const healthBarElement = document.getElementById('health-bar');
        const healthFillElement = document.getElementById('health-fill');
        
        if (healthElement) {
            healthElement.textContent = `${this.player.getHealth()}/${this.player.getMaxHealth()}`;
        }
        
        if (healthFillElement) {
            const healthPercent = (this.player.getHealth() / this.player.getMaxHealth()) * 100;
            healthFillElement.style.width = healthPercent + '%';
            
            // Меняем цвет в зависимости от здоровья
            if (healthPercent > 60) {
                healthFillElement.style.backgroundColor = '#4CAF50'; // зеленый
            } else if (healthPercent > 30) {
                healthFillElement.style.backgroundColor = '#FF9800'; // оранжевый
            } else {
                healthFillElement.style.backgroundColor = '#F44336'; // красный
            }
        }
    }
    
    handlePlayerDamage(enemy) {
        const damageTaken = this.player.takeDamage(CONFIG.ENEMY_DAMAGE);
        
        if (damageTaken) {
            this.updateHealthUI();
            
            // Эффект получения урона (красная вспышка)
            this.showDamageEffect();
            
            // Проверяем смерть игрока
            if (this.player.isDead) {
                this.handleGameOver();
            }
        }
    }
    
    showDamageEffect() {
        // Создаем красную вспышку
        const damageOverlay = document.getElementById('damage-overlay');
        if (damageOverlay) {
            damageOverlay.style.opacity = '0.5';
            setTimeout(() => {
                damageOverlay.style.opacity = '0';
            }, 200);
        }
    }
    
    handleGameOver() {
        this.gameOver = true;
        console.log('GAME OVER! Финальный счет:', this.score);
        
        // Показываем экран окончания игры
        const gameOverElement = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        
        if (gameOverElement) {
            gameOverElement.style.display = 'block';
        }
        
        if (finalScoreElement) {
            finalScoreElement.textContent = this.score;
        }
    }
    
    restartGame() {
        // Перезапускаем игру
        location.reload();
    }
    
    handleEnemyHit(enemy) {
        // Удаляем врага
        this.enemyManager.removeEnemy(enemy);
        
        // Добавляем очки
        this.updateScore(CONFIG.POINTS_PER_ENEMY);
        
        // Создаём нового врага через секунду
        setTimeout(() => {
            if (!this.gameOver) {
                this.enemyManager.spawnNewEnemy();
            }
        }, 1000);
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        // Обновляем игрока
        this.player.update();
        
        // Проверяем столкновения игрока с врагами
        const enemies = this.enemyManager.getEnemies();
        const collidedEnemy = this.player.checkCollisionWithEnemies(enemies);
        if (collidedEnemy) {
            this.handlePlayerDamage(collidedEnemy);
        }
        
        // Обновляем врагов
        this.enemyManager.update(this.player.getPosition());
        
        // Обновляем пули и проверяем попадания
        const hitEnemies = this.bulletManager.update(deltaTime, enemies);
        
        // Обрабатываем попадания
        if (hitEnemies) {
            hitEnemies.forEach(enemy => {
                this.handleEnemyHit(enemy);
            });
        }
    }
    
    animate(currentTime = 0) {
        requestAnimationFrame((time) => this.animate(time));
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.gameScene.render();
    }
}

// Запуск игры
let game;
window.addEventListener('load', () => {
    game = new Game();
});