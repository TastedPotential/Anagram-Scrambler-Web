let charsArray = [];
let textAnchorX;
let textAnchorY;
let sizeOfText;
let widthOfText;
let textGap;
var sketchFont;

function preload(){
  // Went with Ubuntu Mono since it's one of the most equally spaced fonts I found.
  // From Google Fonts: https://fonts.google.com/specimen/Ubuntu+Mono?query=ubuntu&classification=Monospace
  sketchFont = loadFont("fonts/SometypeMono-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAnchorX = windowWidth/2;
  textAnchorY = windowHeight/2;
  sizeOfText = windowWidth/15;
  widthOfText = sizeOfText/2;
  textGap = 0; // divide by 20 for default monospace, 9 for SpaceMono, 0 value for Sometype (not needed)

  textFont(sketchFont);
  textSize(sizeOfText);

  let startingString = "Type your scramble here:";
  for(let i = 0; i < startingString.length; i++){
    charsArray.push(new TextChar(startingString.charAt(i)));
  }
  
}

function draw() {
  background(220);
  textSize(sizeOfText);
  textFont(sketchFont);
  drawText(0, 0);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function drawText(yOffset, kerning){
  if(kerning == 0)
    textGap = kerning;  
  else
    textGap = widthOfText / kerning;

  // This centers the main text horizontally on the screen.
  let windowCenterTextOffsetX = ((charsArray.length * widthOfText) / 2) + (((charsArray.length - 1) * textGap) / 2);

  for(let i = 0; i < charsArray.length; i++){
    text(charsArray[i].savedChar, textAnchorX - windowCenterTextOffsetX + (i * widthOfText) + i * textGap, textAnchorY + yOffset);
  }
}