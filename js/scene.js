class GameScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createSkybox(); // Добавляем скайбокс
        this.createLighting();
        this.createFloor();
        this.setupWindowResize();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        // Убираем туман, так как скайбокс будет фоном
        // this.scene.fog = new THREE.Fog(CONFIG.COLORS.BACKGROUND, 1, CONFIG.FOG_DISTANCE);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.CAMERA_FOV,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, CONFIG.CAMERA_START_HEIGHT, 5);
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(CONFIG.COLORS.BACKGROUND);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }
    
    createSkybox() {
        // Создаем большую сферу для скайбокса
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        
        // Загрузчик текстур
        const textureLoader = new THREE.TextureLoader();
        
        // Загружаем текстуру неба
        // Замените 'path/to/your/sky-texture.jpg' на путь к вашей картинке
        const skyTexture = textureLoader.load(
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop', // Пример URL
            // Колбэк при успешной загрузке
            function(texture) {
                console.log('Текстура неба загружена успешно');
            },
            // Колбэк прогресса загрузки
            function(progress) {
                console.log('Загрузка текстуры неба: ', (progress.loaded / progress.total * 100) + '%');
            },
            // Колбэк при ошибке
            function(error) {
                console.error('Ошибка загрузки текстуры неба:', error);
                // Если текстура не загрузилась, используем градиент
                return null;
            }
        );
        
        // Создаем материал для скайбокса
        let skyMaterial;
        
        if (skyTexture) {
            skyMaterial = new THREE.MeshBasicMaterial({
                map: skyTexture,
                side: THREE.BackSide // Важно! Рендерим внутреннюю сторону сферы
            });
        } else {
            // Запасной вариант - градиентное небо
            skyMaterial = new THREE.MeshBasicMaterial({
                color: 0x87CEEB, // Небесно-голубой цвет
                side: THREE.BackSide
            });
        }
        
        // Создаем меш скайбокса
        const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(skyMesh);
    }
    
    // Альтернативный метод с кубическим скайбоксом (если у вас есть 6 изображений)
    createCubeSkybox() {
        const loader = new THREE.CubeTextureLoader();
        
        // Массив путей к 6 изображениям для кубического скайбокса
        // Порядок: +X (right), -X (left), +Y (top), -Y (bottom), +Z (front), -Z (back)
        const urls = [
            'path/to/right.jpg',   // +X
            'path/to/left.jpg',    // -X
            'path/to/top.jpg',     // +Y
            'path/to/bottom.jpg',  // -Y
            'path/to/front.jpg',   // +Z
            'path/to/back.jpg'     // -Z
        ];
        
        const cubeTexture = loader.load(urls);
        this.scene.background = cubeTexture;
    }
    
    createLighting() {
        // Окружающий свет
        const ambientLight = new THREE.AmbientLight(
            CONFIG.COLORS.AMBIENT_LIGHT,
            0.3
        );
        this.scene.add(ambientLight);
        
        // Направленный свет
        const directionalLight = new THREE.DirectionalLight(
            CONFIG.COLORS.DIRECTIONAL_LIGHT,
            0.8
        );
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }
    
    createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(
            CONFIG.FLOOR_SIZE,
            CONFIG.FLOOR_SIZE
        );
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: CONFIG.COLORS.FLOOR
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }
    
    setupWindowResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    getScene() {
        return this.scene;
    }
    
    getCamera() {
        return this.camera;
    }
    
    getRenderer() {
        return this.renderer;
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}