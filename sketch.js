function setup() {
  createCanvas(windowWidth, windowHeight);
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
