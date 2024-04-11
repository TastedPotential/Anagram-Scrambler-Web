let textManager;
let buttonsManager;
let userDetails;
let mobileDeviceRegExp;
let usingMobileDevice;
let bgColor = 'rgb(55, 67, 117)';
let textColor = 'rgb(253, 253, 249)';
let groupUnderMouse = -1;
let isTouchDevice;

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

  // Touch device detection.
  // Using methods described at https://github.com/processing/p5.js/issues/1815
  // which was discussing issues with double clicks on android. Doesn't seem to be an issue on iOS Safari.
  isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints) ? true : false;
  //print(isTouchDevice);
  // This may catch the detection of being on mobile and allow the PWA version to work on android.
  if(isTouchDevice || windowWidth < windowHeight){
    usingMobileDevice = true;
  }

  // These values will be the percentage of the screen's width to determine the size of said elements.
  let textSizePercentOfScreen = 1/20;
  let buttonSizePercentOfScreen = 1/20;

  if(usingMobileDevice){
    //print("On Mobile");
    textSizePercentOfScreen = 1/12; // Was 1/15 before.
    buttonSizePercentOfScreen = 1/8;
  }
  else{
    //print("On Desktop");
  }

  


  textManager = new TextManager(sketchFont, textSizePercentOfScreen, usingMobileDevice, bgColor, textColor);
  textFont(textManager.sketchFont);
  textSize(textManager.sizeOfText);
  buttonsManager = new ButtonsManager(textManager, buttonSizePercentOfScreen, usingMobileDevice);
  textManager.textInput.show();
  textManager.textInput.elt.focus();
  textManager.buttonsManagerRef = buttonsManager;
}

function draw() {
  //background(255, 251, 161);
  background(bgColor);
  textSize(textManager.sizeOfText);
  textFont(textManager.sketchFont);
  groupUnderMouse = textManager.checkGroupDeletion();
  buttonsManager.drawButtons(groupUnderMouse);
  textManager.drawText();  
  // Draw the grouping brackets
  if(textManager.groupingText){
    buttonsManager.setHoverStatus();
    buttonsManager.drawGroupChoosingBracket();
  }
  else if(textManager.lockingText){
    buttonsManager.setHoverStatus();
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  textManager.updateProperties();
  buttonsManager.updateProperties(textManager);
  //print("window was resized");
}

function keyPressed(){
  // If a number or letter with keyCode (48-90) or a symbol 44-47, 91-93, 192, 222) is pressed, remove the default text.
  // Add the Shift-key modified version of the character by directly reading in the key value.
  // When the key is released, the text input will be handled by the text input box's logic from Javascript.
  if(keyCode >= 44 && keyCode <= 93 || keyCode == 192 || keyCode == 222){
    // Clear default text if any key is pressed.
    if(textManager.defaultMessage == true){
      textManager.clearInputTextValue();
      textManager.defaultMessage = false;
    }
  }  
}

function keyReleased(){
  //print(keyCode);

  // Cull the addition of extra characters beyond the maximum here
  if(keyCode >= 44 && keyCode <= 93 || (keyCode >= 186 && keyCode <= 222)){
    if(textManager.textInput.elt.value.length > textManager.scrambleMaxLength){
      textManager.textInput.elt.value = textManager.textInput.elt.value.substring(0, textManager.scrambleMaxLength);
    }
  }

  // Reset display of default text if all text is removed.
  if(textManager.textInput.elt.value == '' || keyCode == BACKSPACE && textManager.defaultMessage){
    textManager.textInput.elt.value = textManager.startingString;
    textManager.defaultMessage = true;
  } 

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
      textManager.defaultMessage = false;
      textManager.editingText = true;
      textManager.groupingText = false;
      textManager.lockingText = false;
    }    
  }

  // If INSERT is pressed
  if(keyCode == 45){
    textManager.saveScramble(buttonsManager);
  }
}

//MARK: mousePressed
function mousePressed(){
  if(isTouchDevice){    
    // return;
  }

  buttonsManager.setButtonStartedClickOn();
  
  if(textManager.textInputClickedOn()){
    textManager.startedClickOnTextInput = true;
  }
  else if(textManager.groupingText){
    // check which textChar was clicked on
    let clickedCharIndex = buttonsManager.getIndexOfClickedChar();
    // If the click wasn't on a character, abandon and reset group creation.
    if(clickedCharIndex == -1){
      textManager.stopGroupCreation();
      return;
    }
    // If we clicked on a character, it is NOT in a group (groupID == -1, aka default), start the group creation attempt
    // with this character
    if(clickedCharIndex >= 0 && textManager.charsArray[clickedCharIndex].groupID == -1){
      //print("clicked on " + textManager.charsArray[clickedCharIndex].savedChar);
      textManager.groupCreationStartIndex = clickedCharIndex;
    }
  } 
  // return false; // return false at the end to prevent default behavior such as causing extra double clicks.
}

//MARK: mouseReleased
function mouseReleased(){
  if(isTouchDevice){
    // return;
  }
    

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
  // Scramble Button Block
  if(buttonsManager.scrambleButton.isMouseOverButton() && buttonsManager.scrambleButton.startedClickOnThis){
    if(textManager.editingText){
      textManager.setCharsArray(textManager.textInput.elt.value);
    }    
    textManager.scrambleCharsArray();
    textManager.textInput.value(textManager.getCharsArrayAsString());
    // textManager.textInput.hide();
    // textManager.editingText = false;
  }

  //Edit button Block
  else if(buttonsManager.editButton.isMouseOverButton() && buttonsManager.editButton.startedClickOnThis){
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
      textManager.defaultMessage = false;
      textManager.editingText = true;
      textManager.groupingText = false;
      textManager.lockingText = false;
    }
    //TODO
    // Determine if it's a better UX to have the text all selected when clicking the edit button, or instead
    // allow the user to select all at their discretion.
    if(!usingMobileDevice){
      //textManager.textInput.elt.select();
    }
    
  }

  // Save Button Block
  else if(buttonsManager.saveButton.isMouseOverButton() && buttonsManager.saveButton.startedClickOnThis){
    textManager.saveScramble(buttonsManager);
  }

  // Group Mode Toggle Button Block
  else if(buttonsManager.groupButton.isMouseOverButton() && textManager.editingText == false && buttonsManager.groupButton.startedClickOnThis){
    textManager.groupingText = !textManager.groupingText;
    textManager.lockingText = false; 
  }

  // Lock Mode Toggle Button Block
  else if(buttonsManager.lockButton.isMouseOverButton() && textManager.editingText == false && buttonsManager.lockButton.startedClickOnThis){
    textManager.lockingText = !textManager.lockingText;
    textManager.groupingText = false;
  }

  // Text Input Box Block
  else if(textManager.textInputClickedOn()){
    //print("clicked in the textInput box");
    // Don't hide the text input box if the clicks are inside the box, such as when editing text. So don't go to the next check.
    // If the click is on te default text, make the default text disappear when the user starts typing.
    if(textManager.defaultMessage){
      textManager.clearInputTextValue();
      textManager.defaultMessage = false;
    }
  }
  // Group creation/deletion block
  else if(textManager.groupingText){
    // group deletion block
    if(groupUnderMouse >= 0){
      // If the mouse is over a group's bracket and left click is released, delete that group.
      textManager.dismantleGroup(groupUnderMouse);
      return;
    }
    // Group creation block
    // check which textChar was released on
    // Don't attempt to create a group if the start of the current drag was not on a textChar.
    if(textManager.groupCreationStartIndex == -1){
      textManager.stopGroupCreation();
      return;
    }
      

    let clickedCharIndex = buttonsManager.getIndexOfClickedChar();
    // If 1) we clicked on a character, 2) it is NOT in a group (groupID == -1, aka default), 3) did not end the drag over the same starting character
    //start the group creation attempt with this character
    if(clickedCharIndex >= 0 && textManager.charsArray[clickedCharIndex].groupID == -1 && clickedCharIndex != textManager.groupCreationStartIndex){
      //print("clicked on " + textManager.charsArray[clickedCharIndex].savedChar);
      textManager.groupCreationEndIndex = clickedCharIndex;
      textManager.createGroup();
      textManager.stopGroupCreation();
    }
    // reset the group creation start and end indexes if released in invalid conditions or over no chars
    else{
      textManager.stopGroupCreation();
    }
  }
  // Character locking block.
  else if(textManager.lockingText){
    textManager.lockingIndex = buttonsManager.getIndexOfClickedChar();
    if(textManager.lockingIndex >= 0){
      textManager.toggleCharLock();
    }
  }
  // Check series of buttons
  else{
    //Check savedScrambleTextButtonsArray to see if any of those buttons were clicked.
    for(let i = 0; i < buttonsManager.savedScrambleTextButtonsArray.length; i++){
      if(buttonsManager.savedScrambleTextButtonsArray[i].isMouseOverButton()){
        // Copy text to clipboard
        navigator.clipboard.writeText(buttonsManager.savedScrambleTextButtonsArray[i].savedScrambleText);
        return;
      }
    }

    //Check savedScrambleDeletionButtonsArray to see if any of those buttons were clicked.
    for(let i = 0; i < buttonsManager.savedScrambleDeletionButtonsArray.length; i++){
      if(buttonsManager.savedScrambleDeletionButtonsArray[i].isMouseOverButton()){
        // Delete that specific saved scramble entry from the saved scrambles array
        buttonsManager.savedScrambleDeletionButtonsArray.splice(i, 1);
        buttonsManager.savedScrambleTextButtonsArray.splice(i, 1);        
        textManager.updateButtonPositions(buttonsManager);
        textManager.adjustSavedButtonsXOffset(buttonsManager);    
        return;
      }
    }

    
    //print("didn't click on any elements");
    // I think this is where the stored groups are being wiped.
    // TODO
    // Determine if groups & locks should all be removed every time text input is made.
    // Clicked on empty space white text editor is open, aka close the text editor and save the current textInput contents.
    if(textManager.editingText == true){
      textManager.setCharsArray(textManager.textInput.elt.value);
      if(textManager.textInput.elt.value == ''){
        textManager.defaultMessage = true;
      }
      textManager.textInput.hide();
      textManager.editingText = false;
    }
    
  }
  // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
  buttonsManager.resetButtonsClicked();
  //document.getElementById('textInputID').style.display = 'none';
  // return false; // return false at the end to prevent default behavior such as causing extra double clicks.
}

function mouseClicked(){
  // This is only called on mobile/touch devices. It's going to be a reworking of the desktop mousePressed and mouseReleased.
  // if(!isTouchDevice){
  //   return;
  // }

  // buttonsManager.setButtonStartedClickOn();

  // // Save Button Block
  // if(buttonsManager.saveButton.isMouseOverButton() && buttonsManager.saveButton.startedClickOnThis){
  //   textManager.saveScramble(buttonsManager);
  // }

  return false; // return false at the end to prevent default behavior such as causing extra double clicks.

}

