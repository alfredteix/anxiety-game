let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;
let player;
let cursors;
let obstacles;

function startGame() {
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    game = new Phaser.Game(config);
}

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'sky');
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group({
        key: 'bomb',
        repeat: 5,
        setXY: { x: 12, y: 0, stepX: 150 }
    });

    this.physics.add.collider(obstacles, platforms);
    this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    showMotivationalQuote();
}

function showMotivationalQuote() {
    const quotes = [
        "You are not your anxiety.",
        "This too shall pass.",
        "You are stronger than you think.",
        "Keep going, you're doing great."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivational-quote').innerText = randomQuote;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('quote-container').style.display = 'block';
}

function restartGame() {
    document.getElementById('quote-container').style.display = 'none';
    document.getElementById('input-container').style.display = 'block';
    game.destroy(true);
}
