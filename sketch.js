let charsArray = [];
let textAnchorX;
let textAnchorY;
let sizeOfText;
let widthOfText;
let textGap;
var sketchFont;

function preload(){
  sketchFont = loadFont('SpaceMono-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAnchorX = windowWidth/2;
  textAnchorY = windowHeight/2;
  sizeOfText = windowWidth/15;
  widthOfText = sizeOfText/2;
  textGap = sizeOfText / 9; // divide by 20 for default monospace, 9 for SpaceMono.

  textFont(sketchFont);
  textSize(sizeOfText);

  let startingString = "InitialScramble";
  for(let i = 0; i < startingString.length; i++){
    charsArray.push(new TextChar(startingString.charAt(i)));
  }
  
}

function draw() {
  background(220);
  textSize(sizeOfText);
  //textAlign(CENTER);
  for(let i = 0; i < charsArray.length; i++){

    // This centers the main text horizontally on the screen.
    let displayTextXOffset = ((charsArray.length * widthOfText) / 2) + (((charsArray.length - 1) * textGap) / 2);

    text(charsArray[i].savedChar, textAnchorX - displayTextXOffset + (i * widthOfText) + i * textGap, textAnchorY);
  }

  // let displayTextXOffset = (charsArray.length * (widthOfText) / 2);
  // text("InitialScramble", textAnchorX - displayTextXOffset, textAnchorY + 2 * sizeOfText);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
