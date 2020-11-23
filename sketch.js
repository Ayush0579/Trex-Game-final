var trex, trexS, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacle;

var newImage;

var randomOb;

var score;

var cloudGroup;

var obstaclesGroup;

var Game_Over, Die, Jump, Check;

var START, PLAY, END, AFTER, gamestate;

localStorage["High Score"] = 0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  trexS = loadImage("trex1.png");

  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");

  obstacle2 = loadImage("obstacle2.png");

  obstacle3 = loadImage("obstacle3.png");

  obstacle4 = loadImage("obstacle4.png");

  obstacle5 = loadImage("obstacle5.png");

  obstacle6 = loadImage("obstacle6.png");

  Game_Over = loadImage("gameOver.png");

  Re = loadImage("restart.png");

  Die = loadSound("die.mp3");

  Jump = loadSound("jump.mp3");

  Check = loadSound("checkPoint.mp3");

}

function setup() {
  createCanvas(windowWidth,windowHeight);

  START = 0;

  PLAY = 1;

  END = 2;

  AFTER = 3;

  gamestate = START;

  cloudGroup = new Group();
  obstacleGroup = new Group();

  score = 0;

  game = createSprite(width/2,height/2 - 50);
  game.addImage("over", Game_Over);
  game.scale = 0.8;
  game.visible = false;

  re_button = createSprite(width/2, height/2);
  re_button.addImage("Restart_Button", Re);
  re_button.scale = 0.5;
  re_button.visible = false;

  trex = createSprite(50, height-70 , 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = true;
  trex.setCollider("circle", 0, 0, 40);

  ground = createSprite(width/2, height-50 , width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(width/2, height-45, width, 10);
  invisibleGround.visible = false;

}

function draw() {
  background(180);

  fill(0, 0, 0);
  textSize(20);
  text("Score: " + score, 450, 20);
  text("High Score: " + localStorage["High Score"], 280, 20);

  if (gamestate === START) {
    trex.velocityY = 0;
    fill(0, 0, 0);
    textSize(30);
    text("TREX GAME", 200, 50);
    textSize(15);
    text("from Ayush", 380, 50);
    textSize(20);
    text("Press space to start the game and to jump", 110, 100);

    if (keyWentDown("space")|| (touches.length>0)) {
      Jump.play();
      trex.velocityY = -14;
      gamestate = PLAY;
      touches = [];
    }

  } else if (gamestate === PLAY) {

    score = Math.round(frameCount / 3);

    if (score > 0 && score % 100 == 0) {
      Check.play();
    }

    ground.velocityX = -(6 + (3 * score / 100));

    if ((keyDown("space") && trex.collide(invisibleGround))||((touches.length>0) && trex.collide(invisibleGround))){
      Jump.play();
      trex.velocityY = -14;
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();

    obstacles();

    if (obstacleGroup.isTouching(trex)) {
      Die.play();
      gamestate = END;
    }

  } else if (gamestate === END) {

    if (localStorage["High Score"] < score) {
      localStorage["High Score"] = score;
    }

    ground.velocityX = 0;

    trex.velocityY = 0;

    cloudGroup.setVelocityXEach(0);

    cloudGroup.setLifetimeEach(-1);

    obstacleGroup.setVelocityXEach(0);

    obstacleGroup.setLifetimeEach(-1);

    trex.changeAnimation("collided", trex_collided);

    game.visible = true;

    re_button.visible = true;

  }

  if ((mousePressedOver(re_button) && gamestate === END)||((touches.length>0) && gamestate=== END)) {
    reset();
    touches = [];
  }

  trex.collide(invisibleGround);

  console.log(touches);

  drawSprites();
}

function spawnClouds() {

  if (frameCount % 60 === 0) {
    cloud = createSprite(width, 100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(height-200,height-300));
    cloud.scale = 0.4;
    cloud.velocityX = -3;

    if(cloud.x < 0){
    cloud.lifetime = 0;
    }

    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;

    cloudGroup.add(cloud);
  }
}

function obstacles() {

  if (frameCount % 80 === 0) {
    randomOb = Math.round(random(1, 6));

    obstacle = createSprite(width, height-50, 10, 10);
    obstacle.collide(ground);
    obstacle.velocityX = -(6 + (3 * score / 100));
    obstacle.scale = 0.5;
    if(obstacle.x < 0){
      obstacle.lifetime = 0;
    }

    switch (randomOb) {
      case 1:
        obstacle.addImage("o1", obstacle1);
        break;

      case 2:
        obstacle.addImage("o2", obstacle2);
        break;

      case 3:
        obstacle.addImage("o3", obstacle3);
        break;

      case 4:
        obstacle.addImage("o4", obstacle4);
        break;

      case 5:
        obstacle.addImage("o5", obstacle5);
        break;

      case 6:
        obstacle.addImage("o6", obstacle6);
        break;

      default:
        break;
    }

    obstacleGroup.add(obstacle);
  }

}

function reset() {
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  score = 0;
  frameCount = 0;
  gamestate = START;
  trex.y = height-50;
  trex.changeAnimation("running", trex_running);

  game.visible = false;
  re_button.visible = false;

}