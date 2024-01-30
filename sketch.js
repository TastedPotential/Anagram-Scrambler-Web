let mainManager;

function preload(){
  // Went with Ubuntu Mono since it's one of the most equally spaced fonts I found.
  // From Google Fonts: https://fonts.google.com/specimen/Ubuntu+Mono?query=ubuntu&classification=Monospace
  sketchFont = loadFont("fonts/SometypeMono-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mainManager = new TextManager(sketchFont);
  textFont(mainManager.sketchFont);
  textSize(mainManager.sizeOfText);  
}

function draw() {
  background(220);
  textSize(mainManager.sizeOfText);
  textFont(mainManager.sketchFont);
  mainManager.drawText(0, 0);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  mainManager.updateProperties();
}

