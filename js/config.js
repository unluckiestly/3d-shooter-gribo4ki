// Конфигурация игры
const CONFIG = {
    // Игрок
    PLAYER_SPEED: 0.1,
    PLAYER_MAX_HEALTH: 100,
    PLAYER_DAMAGE_COOLDOWN: 1000, // миллисекунды между получением урона
    MOUSE_SENSITIVITY: 0.002,
    
    // Враги (грибы)
    ENEMY_COUNT: 10,
    ENEMY_SPEED: 0.01,
    ENEMY_SPAWN_DISTANCE: 30,
    ENEMY_SIZE: { width: 1.6, height: 2.2, depth: 1.6 }, // увеличили для грибов
    ENEMY_DAMAGE: 20, // урон от врага
    ENEMY_COLLISION_DISTANCE: 2, // расстояние для столкновения с игроком
    POINTS_PER_ENEMY: 10,
    
    // Пули
    BULLET_SPEED: 0.5,
    BULLET_SIZE: 0.1,
    BULLET_LIFETIME: 3000, // миллисекунды
    HIT_DISTANCE: 2, // увеличили для лучшего попадания по грибам
    
    // Мир
    FLOOR_SIZE: 1500,
    FOG_DISTANCE: 100,
    CAMERA_FOV: 75,
    CAMERA_START_HEIGHT: 2,
    
    // Цвета
    COLORS: {
        BACKGROUND: 0x404040,
        FLOOR: 0x228B22, // зеленый цвет для травы
        ENEMY: 0x964B00, // темно-красный для шляпок грибов
        BULLET: 0xffff00,
        AMBIENT_LIGHT: 0x404040,
        DIRECTIONAL_LIGHT: 0xffffff
    }
};