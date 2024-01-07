var charsAL = [];
var allCharString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function setup() {
  createCanvas(windowWidth, windowHeight);

  print("allCharString length: " + allCharString.length);
  print("random index from allCharString: " + floor(random(0, allCharString.length)));
  print("Random float: " + Math.floor(Math.random() * (allCharString.length)));

  for( var i = 0; i < 63; i++){
    let randIndex = Math.floor(Math.random() * (allCharString.length));
    let randChar = allCharString.charAt(randIndex);
    print("randomIndex was: " + randIndex + " with char: " + randChar + " " + Number(random()).toFixed(2));
    charsAL[i] = new TextChar(randChar);
  }

  
}

function draw() {
  background(220);
  textSize(windowWidth/15);
  textAlign(CENTER);
  text("This site will contain \nmy project.", windowWidth / 2, windowHeight * .48);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
