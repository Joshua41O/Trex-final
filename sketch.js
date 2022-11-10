
var trex ,trex_running,trex_collided;
var ground, invisibleGround, groundImage, cloudImage;
var gameOver,restart,gameOverImage,restartImage;
var PLAY=1;
var END=0;
var gameState=PLAY;
function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage=loadImage("ground2.png")
  trex_collided=loadAnimation("trex_collided.png");
  cloudImage=loadImage("cloud.png");

  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");

  restartImage=loadImage("restart.png");
  gameOverImage=loadImage("gameOver.png");

  Sound=loadSound("jump.mp3");
  Sound3=loadSound("checkpoint.mp3");
  Sound2=loadSound("die.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  //crear sprite de Trex
 trex=createSprite(50,height-40,20,100);
 trex.addAnimation("running",trex_running);
 trex.scale=0.5;
 trex.addAnimation("collided",trex_collided);

 gameOver=createSprite(width/2,height/2-50);
 gameOver.addImage(gameOverImage);
 gameOver.scale=0.5;
 gameOver.visible=false;

 restart=createSprite(width/2,height/2);
 restart.addImage(restartImage);
 restart.scale=0.5;
 restart.visible=false;

 ground=createSprite(width/2,height-10,width,125);
 ground.addImage("ground",groundImage)
 ground.x=ground.width/2;


 invisibleGround=createSprite(width/2,height-5,width,1);
 invisibleGround.visible=false;

 obstacleGroup=createGroup();
 cloudGroup=createGroup();

var rand=Math.round(random(1,100))
//trex.setCollider("rectanglec",0,0,400,trex.height) Activar ia
trex.setCollider("circle",0,0,40);
trex.debug=true

console.log(rand)
score=0;
}

function draw(){
  background("white")
  text("Puntuacion:  "+score,width-100,50);
  if(gameState===PLAY){
    ground.velocityX=-(4+3*score/100)
    score=score+Math.round(getFrameRate()                                     /60)
    if(score>0 && score%100===0){
      Sound3.play();
    }

    if(ground.x<0){
      ground.x=ground.width/2;
    }

    if((touches.length>0 ||keyDown("space"))&& trex.y>=100){
      trex.velocityY=-10;
      Sound.play();
      touches=[]
    }

    trex.velocityY=trex.velocityY+0.8;
    spawnObtacles();
    aparecernubes();

    if (obstacleGroup.isTouching(trex)){
      //trex.velocityY=-12 

      gameState=END;
     Sound2.play();
    }


  }
  else if (gameState===END){
     ground.velocityX=0;
     trex.velocityY=0;
     gameOver.visible=true;
     trex.changeAnimation("collided",trex_collided);
     obstacleGroup.setLifetimeEach(-1);
     cloudGroup.setLifetimeEach(-1);
     restart.visible=true;
     obstacleGroup.setVelocityXEach(0);
     cloudGroup.setVelocityXEach(0);
  }
  trex.collide(invisibleGround);
  if(touches.length>0 ||mousePressedOver(restart)){
    console.log("Reiniciar el juego")
    reset();
    touches=[]
  }
  drawSprites();
  

}
  function reset(){
    gameState=PLAY
    gameOver.visible=false
    restart.visible=false
    trex.changeAnimation("running",trex_running)
    obstacleGroup.destroyEach()
    cloudGroup.destroyEach()
    score=0
  }

function aparecernubes(){
if (frameCount%60===0){
  cloud=createSprite(width/2,100,40,10);
  cloud.addImage(cloudImage);
  cloud.y=Math.round(random(10,height-200));
  cloud.scale=0.9;
  cloud.velocityX=-3;
  cloud.lifetime=220;
  console.log(trex.depth);
  console.log(cloud.depth)
  cloud.depth=trex.depth
  trex.depth=trex.depth+1
  cloudGroup.add(cloud);
}
}
function spawnObtacles(){
  if(frameCount%60===0){
    var obstacle=createSprite(width/2,height-20,width,125);
    obstacle.velocityX=-(6+score/100);


    rand=Math.round(random(1,6))
    switch(rand){
      case 1: obstacle.addImage(obstacle1)
      break;
      case 2: obstacle.addImage(obstacle2)
      break;
      case 3: obstacle.addImage(obstacle3)
      break;
      case 4: obstacle.addImage(obstacle4)
      break;
      case 5: obstacle.addImage(obstacle5)
      break;
      case 6: obstacle.addImage(obstacle6)
      break;
      default:break;
    }
    obstacle.scale=0.5;
    obstacle.lifetime=220;
    obstacleGroup.add(obstacle);
  }
}