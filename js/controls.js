class GameControls {
    constructor(player, gameInstance) {
        this.player = player;
        this.game = gameInstance;
        this.isPointerLocked = false;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.setupKeyboardControls();
        this.setupMouseControls();
        this.setupPointerLock();
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Обработка клавиш игрока
            this.player.handleKeyDown(e.code);
            
            // Перезапуск игры на R
            if (e.code === 'KeyR' && this.game.gameOver) {
                this.game.restartGame();
            }
            
            // ESC для выхода из pointer lock
            if (e.code === 'Escape') {
                if (this.isPointerLocked) {
                    document.exitPointerLock();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.player.handleKeyUp(e.code);
        });
    }
    
    setupMouseControls() {
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked && !this.game.gameOver) {
                this.player.handleMouseMove(e.movementX, e.movementY);
            }
        });
        
        document.addEventListener('click', (e) => {
            // Если игра окончена, не реагируем на клики
            if (this.game.gameOver) {
                return;
            }
            
            if (!this.isPointerLocked) {
                this.requestPointerLock();
            } else {
                // Стрельба только если игрок жив
                if (!this.player.isDead) {
                    this.game.shoot();
                }
            }
        });
    }
    
    setupPointerLock() {
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === this.game.gameScene.getRenderer().domElement;
            
            // Если потеряли pointer lock во время игры
            if (!this.isPointerLocked && !this.game.gameOver) {
                console.log('Pointer lock потерян. Кликните для продолжения игры.');
            }
        });
        
        document.addEventListener('pointerlockerror', () => {
            console.error('Pointer lock failed');
        });
    }
    
    requestPointerLock() {
        // Не захватываем мышь если игра окончена
        if (this.game.gameOver) {
            return;
        }
        
        const element = this.game.gameScene.getRenderer().domElement;
        element.requestPointerLock = element.requestPointerLock ||
                                   element.mozRequestPointerLock ||
                                   element.webkitRequestPointerLock;
        element.requestPointerLock();
    }
    
    getPointerLockState() {
        return this.isPointerLocked;
    }
}