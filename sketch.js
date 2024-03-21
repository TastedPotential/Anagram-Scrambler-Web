let textManager;
let buttonsManager;
let userDetails;
let mobileDeviceRegExp;
let usingMobileDevice;
let bgColor = 'rgb(55, 67, 117)';
let textColor = 'rgb(253, 253, 249)';

function preload(){
  // Ultimately returned to CourierPrime for its readability and monospace width.
  // I added a bit of spacing to make up for some characters touching/overlapping.
  // Font downloaded from Google Fonts here: https://fonts.google.com/specimen/Courier+Prime?query=courier+prime
  sketchFont = loadFont("fonts/CourierPrime-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //background(255, 251, 161);
  background(bgColor);
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
    buttonSizePercentOfScreen = 1/8;
  }
  else{
    //print("On Desktop");
  }


  textManager = new TextManager(sketchFont, textSizePercentOfScreen, usingMobileDevice, bgColor, textColor);
  textFont(textManager.sketchFont);
  textSize(textManager.sizeOfText);
  buttonsManager = new ButtonsManager(textManager, buttonSizePercentOfScreen, usingMobileDevice);
}

function draw() {
  //background(255, 251, 161);
  background(bgColor);
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
  //print(keyCode);
  // For spacebar pressed.
  if(keyCode == 32 && textManager.editingText == false){
    textManager.scrambleCharsArray();
    textManager.textInput.value(textManager.getCharsArrayAsString());
    textManager.textInput.hide();
  }

  if(keyCode == ENTER || keyCode == RETURN){
    if(textManager.editingText)
    {
      textManager.setCharsArray(textManager.textInput.elt.value);
      textManager.textInput.hide();
      textManager.editingText = false;
      if(textManager.textInput.elt.value == ''){
        textManager.defaultMessage = true;
      }
    }
    else{
      textManager.setTextInputValue();
      textManager.textInput.show();
      textManager.textInput.elt.focus();
      textManager.editingText = true;
    }    
  }

  // If INSERT is pressed
  if(keyCode == 45){
    textManager.saveScramble(buttonsManager);
  }
}

function mousePressed(){
  if(buttonsManager.scrambleButton.clickedOn()){
    buttonsManager.scrambleButton.startedClickOnThis = true;
  }
  else if(buttonsManager.editButton.clickedOn()){
    buttonsManager.editButton.startedClickOnThis = true;
  }
  else if(textManager.textInputClickedOn()){
    textManager.startedClickOnTextInput = true;
  }
}

function mouseReleased(){
  // If a click was started inside the textInput box, but then let go anywhere else, don't change anything.
  // This allows for the user to drag and select text while editing, then is able to let go anywhere outside the box without issues.
  if(textManager.startedClickOnTextInput){
    // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
    textManager.startedClickOnTextInput = false;
    buttonsManager.scrambleButton.startedClickOnThis = false;
    buttonsManager.editButton.startedClickOnThis = false;

    if(textManager.defaultMessage){
      textManager.clearInputTextValue();
      textManager.defaultMessage = false;
    }

    return;
  }
 
  if(buttonsManager.scrambleButton.clickedOn() && buttonsManager.scrambleButton.startedClickOnThis){
    textManager.setCharsArray(textManager.textInput.elt.value);
    textManager.scrambleCharsArray();
    textManager.textInput.value(textManager.getCharsArrayAsString());
    // textManager.textInput.hide();
    // textManager.editingText = false;
  }
  else if(buttonsManager.editButton.clickedOn() && buttonsManager.editButton.startedClickOnThis){
    if(textManager.editingText)
    {
      textManager.setCharsArray(textManager.textInput.elt.value);
      textManager.textInput.hide();
      textManager.editingText = false;
    }
    else{
      textManager.setTextInputValue();
      textManager.textInput.show();
      textManager.textInput.elt.focus();
      textManager.editingText = true;
    }
    //TODO
    // Determine if it's a better UX to have the text all selected when clicking the edit button, or instead
    // allow the user to select all at their discretion.
    if(!usingMobileDevice){
      //textManager.textInput.elt.select();
    }
    
  }
  else if(buttonsManager.saveButton.clickedOn()){
    textManager.saveScramble(buttonsManager);
  }
  else if(textManager.textInputClickedOn()){
    //print("clicked in the textInput box");
    // Don't hide the text input box if the clicks are inside the box, such as when editing text. So don't go to the next check.
    // If the click is on te default text, make the default text disappear when the user starts typing.
    if(textManager.defaultMessage){
      textManager.clearInputTextValue();
      textManager.defaultMessage = false;
    }
  }
  else{

    //Check savedScrambleTextButtonsArray to see if any of those buttons were clicked.
    for(let i = 0; i < buttonsManager.savedScrambleTextButtonsArray.length; i++){
      if(buttonsManager.savedScrambleTextButtonsArray[i].clickedOn()){
        // Copy text to clipboard
        navigator.clipboard.writeText(buttonsManager.savedScrambleTextButtonsArray[i].savedScrambleText);
        return;
      }
    }

    //Check savedScrambleDeletionButtonsArray to see if any of those buttons were clicked.
    for(let i = 0; i < buttonsManager.savedScrambleDeletionButtonsArray.length; i++){
      if(buttonsManager.savedScrambleDeletionButtonsArray[i].clickedOn()){
        // Delete that specific saved scramble entry from the saved scrambles array
        buttonsManager.savedScrambleDeletionButtonsArray.splice(i, 1);
        buttonsManager.savedScrambleTextButtonsArray.splice(i, 1);        
        textManager.updateButtonPositions(buttonsManager);
        textManager.adjustSavedButtonsXOffset(buttonsManager);    
        return;
      }
    }

    //print("didn't click on any elements");
    textManager.setCharsArray(textManager.textInput.elt.value);
    if(textManager.textInput.elt.value == ''){
      textManager.defaultMessage = true;
    }
    textManager.textInput.hide();
    textManager.editingText = false;
  }

  // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
  buttonsManager.scrambleButton.startedClickOnThis = false;
  buttonsManager.editButton.startedClickOnThis = false;
      
    //document.getElementById('textInputID').style.display = 'none';
  

  

}

