let textManager;
let buttonsManager;
let userDetails;
let mobileDeviceRegExp;
let usingMobileDevice;
let bgColor = 'rgb(55, 67, 117)';
let textColor = 'rgb(253, 253, 249)';
let groupUnderMouse = -1;
let isTouchDevice;
let usingAppleTouchDevice;
let debugDrawStatus = false;

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
  print(userDetails);

  // Touch device detection.
  // Using methods described at https://github.com/processing/p5.js/issues/1815
  // which was discussing issues with double clicks on android. Doesn't seem to be an issue on iOS Safari.
  isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints) ? true : false;
  //print(isTouchDevice);
  // This may catch the detection of being on mobile and allow the PWA version to work on android.
  if(isTouchDevice || windowWidth < windowHeight){
    print('on touch device');
    //usingMobileDevice = true;
  }
  // Give an exception to the no-dragging version to iOS/iPad devices since they seem to be able to use the desktop version with
  // dragging and all that just fine.
  let appleTouchDeviceRegExp = /iphone|ipad/i;
  usingAppleTouchDevice = appleTouchDeviceRegExp.test(userDetails);
  if(usingAppleTouchDevice){
    print('using apple touch device');
    //isTouchDevice = false;
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

  


  textManager = new TextManager(sketchFont, textSizePercentOfScreen, usingMobileDevice, bgColor, textColor, usingAppleTouchDevice);
  textFont(textManager.sketchFont);
  textSize(textManager.sizeOfText);
  buttonsManager = new ButtonsManager(textManager, buttonSizePercentOfScreen, usingMobileDevice, isTouchDevice);
  textManager.textInput.show();
  textManager.textInput.elt.focus();

  // Only set the focus on the textInput at the start if on desktop or on android.
  // if(!usingAppleTouchDevice){
  //   textManager.textInput.elt.focus();
  // }
  textManager.buttonsManagerRef = buttonsManager;
}

//MARK: draw
function draw() {
  //background(255, 251, 161);
  background(bgColor);
  textSize(textManager.sizeOfText);
  textFont(textManager.sketchFont);
  groupUnderMouse = textManager.checkGroupDeletion();
  buttonsManager.drawButtons(groupUnderMouse);
  textManager.drawText();

  debugDrawShape();

  // Don't draw anything hovering related on android mobile because mobile cannot detect hovering anyway.
  if(isTouchDevice && !usingAppleTouchDevice)
    return;
  // Draw the grouping brackets & backgrounds of textChars being hovered over
  if(textManager.groupingText){
    if(usingAppleTouchDevice && !mouseIsPressed){
      //buttonsManager.drawGroupChoosingBracket();
      return;
    }
    buttonsManager.setHoverStatus();
    buttonsManager.drawGroupChoosingBracket();
  }
  else if(textManager.lockingText){
    if(usingAppleTouchDevice && !mouseIsPressed)
      return;
    buttonsManager.setHoverStatus();
  }

  // // check on android if saved text is over the limit.
  // // Have to check separately because android doesn't seem to be picking up keyReleased when entering text.
  // if(!textManager.defaultMessage && textManager.textInput.elt.value.length > textManager.scrambleMaxLength){
  //   textManager.textInput.elt.value = textManager.textInput.elt.value.substring(0, textManager.scrambleMaxLength);
  // }
}

function windowResized(){
  if(usingMobileDevice && !usingAppleTouchDevice){
    return;
  }
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

  // // Cull the addition of extra characters beyond the maximum here
  // if(keyCode >= 44 && keyCode <= 93 || (keyCode >= 186 && keyCode <= 222)){
  //   if(textManager.textInput.elt.value.length > textManager.scrambleMaxLength){
  //     textManager.textInput.elt.value = textManager.textInput.elt.value.substring(0, textManager.scrambleMaxLength);
  //   }
  // }

  // Reset display of default text if all text is removed.
  if(textManager.textInput.elt.value == '' || keyCode == BACKSPACE && textManager.defaultMessage){
    // Don't clear the text on android.
    if(usingMobileDevice && !usingAppleTouchDevice){
      return;
    }
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

// Disabling block for iOS devices. Will also be affecting android as well it seems.
// function touchStarted(){
//   return false;
// }

// function touchMoved(){
//   return false;
// }

// function touchEnded(){
//   return false;
// }



//MARK: mousePressed
function mousePressed(){
  if(isTouchDevice && !usingAppleTouchDevice){
    // if(!usingAppleTouchDevice){
    //   return;
    // }
    return;
  }

  buttonsManager.setButtonStartedClickOn();
  
  if(textManager.textInputClickedOn()){
    textManager.startedClickOnTextInput = true;
    if(!isTouchDevice && !usingAppleTouchDevice){
      // debugDrawStatusToggle();
      return;
    }
  }
  else if(textManager.groupingText){
    // check which textChar was clicked on
    buttonsManager.clickedCharIndex = buttonsManager.getIndexOfClickedChar();
    // If the click wasn't on a character, abandon and reset group creation.
    if(buttonsManager.clickedCharIndex == -1){
      textManager.stopGroupCreation();
      return;
    }
    // If we clicked on a character, it is NOT in a group (groupID == -1, aka default), start the group creation attempt
    // with this character
    if(buttonsManager.clickedCharIndex >= 0 && textManager.charsArray[buttonsManager.clickedCharIndex].groupID == -1){
      //print("clicked on " + textManager.charsArray[clickedCharIndex].savedChar);
      textManager.groupCreationStartIndex = buttonsManager.clickedCharIndex;
    }
  }
  else if(textManager.lockingIndex == -1){
    buttonsManager.clickedCharIndex = buttonsManager.getIndexOfClickedChar();
  }
  return; // return false at the end to prevent default behavior such as causing extra double clicks.
}

//MARK: mouseReleased
function mouseReleased(){
  if(isTouchDevice && !usingAppleTouchDevice){
    // if(!usingAppleTouchDevice){
    //   return;
    // }
    return;
  }
    
  // If a click was started inside the textInput box, but then let go anywhere else, don't change anything.
  // This allows for the user to drag and select text while editing, then is able to let go anywhere outside the box without issues.
  if(textManager.startedClickOnTextInput){
    // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
    textManager.startedClickOnTextInput = false;
    buttonsManager.resetButtonsClicked();
    buttonsManager.resetTextCharButtonsBGs();

    // Clear the default message upon releasing the mouse anywhere.
    if(textManager.defaultMessage){
      textManager.clearInputTextValue();
      textManager.defaultMessage = false;
    }

    // if(!isTouchDevice && !usingAppleTouchDevice){
    //   debugDrawStatusToggle();
    //   return;
    // }

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
    return false;
    
  }

  // Save Button Block
  else if(buttonsManager.saveButton.isMouseOverButton() && buttonsManager.saveButton.startedClickOnThis && !textManager.defaultMessage && textManager.textInput.value() != ''){
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

  // Delete All Saved Scrambles Block
  else if(buttonsManager.deleteAllButton.isMouseOverButton() && buttonsManager.deleteAllButton.startedClickOnThis){
    textManager.deleteAllSavedScrambles();
    buttonsManager.deleteAllSavedScrambleButtons();
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
      let groupHeadBeingCheckedIndex = -1;
      // Check if the group is currently locked. If it is locked, do NOT dismantle the group.
      for(let i = 0; i < textManager.charsArray.length; i++){
        if(textManager.charsArray[i].groupID === groupUnderMouse){
          groupHeadBeingCheckedIndex = i;
          break;
        }
      }

      // Shake the lock of the group the user attempted to ungroup.
      if(textManager.charsArray[groupHeadBeingCheckedIndex].isLocked){
        textManager.startLockShaking(groupHeadBeingCheckedIndex);
      }
      else{
        // If the mouse is over a group's bracket and left click is released, delete that group.
        textManager.dismantleGroup(groupUnderMouse);
        // return false;
      }
      
      
    } // End of group deletion

    // Group creation block
    // check which textChar was released on
    // Don't attempt to create a group if the start of the current drag was not on a textChar.
    if(textManager.groupCreationStartIndex == -1){
      textManager.stopGroupCreation();
      // return false;
    }
      

    let clickedCharIndex = buttonsManager.getIndexOfClickedChar();
    // If 1) we clicked on a character, 2) did not end the drag over the same starting character start the group creation attempt with this character.
    // Removed the check that the attempted character was not single since it will now be stopped later in the createGroup() method.
    if(clickedCharIndex >= 0 && clickedCharIndex != textManager.groupCreationStartIndex){
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
  // If this click started its drag on a character while in grouping mode and released anywhere else (having passed the 
  // previous grouping checks), don't allow the user to release the drag over anything else and have it activate, such 
  // as a saved scramble's text to copy to clipboard or deleting a saved scramble. 
  if((textManager.groupingText || textManager.lockingText) && buttonsManager.clickedCharIndex >= 0){
    print('started click on a textChar but ended elsewhere, so breaking out of mouseReleased');
    buttonsManager.resetTextCharButtonsBGs();
    textManager.stopGroupCreation();
    buttonsManager.clickedCharIndex = -1;
    return false;
  }

  // Don't change the background color of any characters when clicking on them except for when locking or grouping. 
  if(!textManager.groupingText || !textManager.lockingText){
    buttonsManager.resetTextCharButtonsBGs();
  }
    

  //Check savedScrambleTextButtonsArray to see if any of those buttons were clicked.
  for(let i = 0; i < buttonsManager.savedScrambleTextButtonsArray.length; i++){
    if(buttonsManager.savedScrambleTextButtonsArray[i].isMouseOverButton()){
      // Copy text to clipboard
      navigator.clipboard.writeText(buttonsManager.savedScrambleTextButtonsArray[i].savedScrambleText);
      // Display animation of "Copied to clipboard" only on non-android.
      if(!isTouchDevice || usingAppleTouchDevice){
        textManager.startClipboardToastAnimation();
      }
      return false;
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
      return false;
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
    
  
  // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
  buttonsManager.resetButtonsClicked();
  buttonsManager.resetTextCharButtonsBGs();
  //document.getElementById('textInputID').style.display = 'none';
  return false; // return false at the end to prevent default behavior such as causing extra double clicks.
}








//MARK: mouseClicked
// Click only version of everything for android.
function mouseClicked(){

  // background(255,0,0);
  // print('clicked on touch device');

  // This is only called on mobile/touch devices. It's going to be a reworking of the desktop mousePressed and mouseReleased.
  if(!isTouchDevice || usingAppleTouchDevice){
    // if(usingAppleTouchDevice){
    //   return false;
    // }
    return false;
  }

  // debugDrawStatusToggle();

  

  if(textManager.textInputClickedOn()){
    // if(usingAppleTouchDevice){
    //   return false;
    // }
    // return;// should allow text to be selected while in edit mode.
    textManager.startedClickOnTextInput = true;
  }
  // If a click was started inside the textInput box, but then let go anywhere else, don't change anything.
  // This allows the user to drag and select text while editing, then is able to let go anywhere outside the box without issues.
  if(textManager.startedClickOnTextInput){
    // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
    textManager.startedClickOnTextInput = false;
    buttonsManager.resetButtonsClicked();

    // Clear the default message upon releasing the mouse anywhere.
    if(textManager.defaultMessage){
      textManager.clearInputTextValue();
      textManager.defaultMessage = false;
    }

    return;
  }


  buttonsManager.setButtonStartedClickOn();

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
      // If the edit button was clicked and the inputText in blank, reset it to display the default text.
      if(textManager.textInput.elt.value == ''){
        textManager.textInput.elt.value = textManager.startingString;
        textManager.defaultMessage = true;
      }
    }
    else{
      // TODO
      // I think the white bar on the right is happening here on android.
      textManager.setTextInputValue();
      // textManager.resetTextInputPosition()  // Reset textInput position on android here.
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

    return;
    
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

  // Delete All Saved Scrambles Block
  else if(buttonsManager.deleteAllButton.isMouseOverButton() && buttonsManager.deleteAllButton.startedClickOnThis){
    textManager.deleteAllSavedScrambles();
    buttonsManager.deleteAllSavedScrambleButtons();
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

    groupUnderMouse = textManager.checkGroupDeletion();
    // group deletion block
    if(groupUnderMouse >= 0){

      // Check to not ungroup a locked group. Also shake the lock if attempted.
      let groupHeadBeingCheckedIndex = -1;
      // Check if the group is currently locked. If it is locked, do NOT dismantle the group.
      for(let i = 0; i < textManager.charsArray.length; i++){
        if(textManager.charsArray[i].groupID === groupUnderMouse){
          groupHeadBeingCheckedIndex = i;
          break;
        }
      }

      // Shake the lock of the group the user attempted to ungroup.
      if(textManager.charsArray[groupHeadBeingCheckedIndex].isLocked){
        textManager.startLockShaking(groupHeadBeingCheckedIndex);
      }
      else{
        // If the mouse is over a group's bracket and left click is released, delete that group.
        textManager.dismantleGroup(groupUnderMouse);
        // return false;
      }



      
    } // End of group deletion

    // Get the character clicked on.
    let clickedCharIndex = buttonsManager.getIndexOfClickedChar();
    
    // Group creation block
    // If the first character of a group hasn't been set and if we clicked on a character,
    // it is NOT in a group (groupID == -1, aka default), start the group creation attempt with this character.
    if(textManager.groupCreationStartIndex == -1 && clickedCharIndex >= 0 && textManager.charsArray[clickedCharIndex].groupID == -1){
      textManager.groupCreationStartIndex = clickedCharIndex;
    }
    // Otherwise check if a valid group ending index was clicked. If so, create a group with those two characters.
    else if(clickedCharIndex != textManager.groupCreationStartIndex && textManager.groupCreationStartIndex >= 0 &&
      clickedCharIndex >= 0){
      textManager.groupCreationEndIndex = clickedCharIndex;
      textManager.createGroup();
      textManager.stopGroupCreation();

      buttonsManager.resetTextCharButtonHoverStatuses();
    } 
    // Reset group creation if a valid character wasn't clicked on.
    else{
      textManager.stopGroupCreation();
      buttonsManager.resetTextCharButtonHoverStatuses();
    }

    // if(textManager.groupCreationStartIndex == -1){
    //   textManager.stopGroupCreation();
    //   return;
    // }
    
    //let clickedCharIndex = buttonsManager.getIndexOfClickedChar();
    // If 1) we clicked on a character, 2) it is NOT in a group (groupID == -1, aka default), 3) did not end the drag over the same starting character
    //start the group creation attempt with this character

    // if(clickedCharIndex >= 0 && textManager.charsArray[clickedCharIndex].groupID == -1 && clickedCharIndex != textManager.groupCreationStartIndex){
    //   //print("clicked on " + textManager.charsArray[clickedCharIndex].savedChar);
    //   textManager.groupCreationEndIndex = clickedCharIndex;
    //   textManager.createGroup();
    //   textManager.stopGroupCreation();
    // }
    // // reset the group creation start and end indexes if released in invalid conditions or over no chars
    // else{
    //   textManager.stopGroupCreation();
    // }
  }
  // Character locking block.
  else if(textManager.lockingText){
    textManager.lockingIndex = buttonsManager.getIndexOfClickedChar();
    if(textManager.lockingIndex >= 0){
      textManager.toggleCharLock();
    }
    buttonsManager.resetTextCharButtonHoverStatuses();
  }
  // Check series of buttons
  

  // // If this click started its drag on a character while in grouping mode and released anywhere else (having passed the 
  // // previous grouping checks), don't allow the user to release the drag over anything else and have it activate, such 
  // // as a saved scramble's text to copy to clipboard or deleting a saved scramble. 
  // if((textManager.groupingText || textManager.lockingText) && buttonsManager.clickedCharIndex >= 0){
  //   print('started click on a textChar but ended elsewhere, so breaking out of mouseReleased');
  //   textManager.stopGroupCreation();
  //   buttonsManager.clickedCharIndex = -1;
  //   return false;
  // }

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
    // If the click was made anywhere not on a button while editing text and the field was blank, reset to default text.
    if(textManager.textInput.elt.value == ''){
      textManager.textInput.elt.value = textManager.startingString;
      textManager.defaultMessage = true;
    }
    textManager.textInput.hide();
    textManager.editingText = false;
  }
    
  
  // Set all buttons that were clicked on back to false. There's probably a cleaner way to do this.
  buttonsManager.resetButtonsClicked();

  return;
}



function debugDrawShape(){  
  if(debugDrawStatus){
    rect(width / 2, height * .75, width / 6, width / 6);
  }
}

function debugDrawStatusToggle(){
  debugDrawStatus = !debugDrawStatus;
}