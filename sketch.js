let textManager;
let buttonsManager;


let userDetails;
let mobileDeviceRegExp;
let usingMobileDevice;

function preload(){
  // Ultimately returned to CourierPrime for its readability and monospace width.
  // I added a bit of spacing to make up for some characters touching/overlapping.
  // Font downloaded from Google Fonts here: https://fonts.google.com/specimen/Courier+Prime?query=courier+prime
  sketchFont = loadFont("fonts/CourierPrime-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Mobile vs desktop detection adapted from
  // https://www.geeksforgeeks.org/how-to-detect-whether-the-website-is-being-opened-in-a-mobile-device-or-a-desktop-in-javascript/
  // and https://editor.p5js.org/ronikaufman/sketches/yaVtDVBK5
  // Chunk for determining mobile vs desktop. Store details from the userAgent, create a regular expression that has the strings of various
  // mobile devices that could be in the userAgent's details, and then use test() to get a boolean on whether or not
  // the program is being viewed on mobile or desktop.
  userDetails = navigator.userAgent;
  mobileDeviceRegExp = /android|iphone|kindle|ipad/i;
  usingMobileDevice = mobileDeviceRegExp.test(userDetails);

  // These values will be the percentage of the screen's width to determine the size of said elements.
  let textSizePercentOfScreen = 1/20;
  let buttonSizePercentOfScreen = 1/20;

  if(usingMobileDevice){
    //print("On Mobile");
    textSizePercentOfScreen = 1/15;
    buttonSizePercentOfScreen = 1/10;
  }
  else{
    //print("On Desktop");
  }


  textManager = new TextManager(sketchFont, textSizePercentOfScreen);
  textFont(textManager.sketchFont);
  textSize(textManager.sizeOfText);
  buttonsManager = new ButtonsManager(textManager, buttonSizePercentOfScreen, usingMobileDevice);
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
  print("window was resized");
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
    textManager.textInput.value(textManager.getCharsArrayAsString());
    textManager.textInput.hide();
  }
  else if(buttonsManager.editButton.clickedOn()){
    textManager.textInput.show();
    textManager.textInput.elt.focus();
    //TODO
    // Determine if it's a better UX to have the text all selected when clicking the edit button, or instead
    // allow the user to select all at their discretion.
    if(!usingMobileDevice){
      //textManager.textInput.elt.select();
    }
    
  }
  else if(textManager.textInputClickedOn()){
    print("clicked in the textInput box");
  }
  else{
    print("didn't click on any elements");
    textManager.textInput.hide();  
  }
      
    //document.getElementById('textInputID').style.display = 'none';
  

  

}

