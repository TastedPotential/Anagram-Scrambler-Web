let textManager;
let buttonsManager;

function preload(){
  // Ultimately returned to CourierPrime for its readability and monospace width.
  // I added a bit of spacing to make up for some characters touching/overlapping.
  // Font downloaded from Google Fonts here: https://fonts.google.com/specimen/Courier+Prime?query=courier+prime
  sketchFont = loadFont("fonts/CourierPrime-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textManager = new TextManager(sketchFont, 20);
  textFont(textManager.sketchFont);
  textSize(textManager.sizeOfText);
  buttonsManager = new ButtonsManager(textManager, 20);
}

function draw() {
  background(220);
  textSize(textManager.sizeOfText);
  textFont(textManager.sketchFont);
  textManager.drawText(0);
  buttonsManager.drawButtons();  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  textManager.updateProperties();
  buttonsManager.updateProperties(textManager);
}

function keyReleased(){  
  // For spacebar pressed.
  if(keyCode == 32){
    textManager.scrambleCharsArray();
  }
}

function mouseReleased(){
  if(buttonsManager.scrambleButton.clickedOn()){
    textManager.scrambleCharsArray();
  }

}

