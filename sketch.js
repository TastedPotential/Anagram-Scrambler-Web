let mainManager;

function preload(){
  // Ultimately returned to CourierPrime for its readability and monospace width.
  // I added a bit of spacing to make up for some characters touching/overlapping.
  // Font downloaded from Google Fonts here: https://fonts.google.com/specimen/Courier+Prime?query=courier+prime
  sketchFont = loadFont("fonts/CourierPrime-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mainManager = new TextManager(sketchFont, 20);
  textFont(mainManager.sketchFont);
  textSize(mainManager.sizeOfText);  
}

function draw() {
  background(220);
  textSize(mainManager.sizeOfText);
  textFont(mainManager.sketchFont);
  mainManager.drawText(0, 6);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  mainManager.updateProperties();
}

function keyReleased(){
  print(keyCode);
  if(keyCode == 32){
    mainManager.scrambleCharsArray();
  }
}

