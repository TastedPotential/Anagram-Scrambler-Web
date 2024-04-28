class TextManager{

    constructor(inputFont, inputTextSizePercentage, inUsingMobile, textBoxBGColor, inTextColor, inUsingAppleTouchDevice){
        this.charsArray = [];
        this.textSizePercentage = inputTextSizePercentage;
        this.sizeOfText = windowWidth * this.textSizePercentage;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = this.widthOfText / 6; // divide by 6 for CourierPrime 20 for default monospace, 9 for SpaceMono, 0 value for SomeType (not needed)
        this.editingText = true;
        this.defaultMessage = true; // This changes after the user adds ANY characters to be scrambled. It is reset if the user deletes all text in the input box.
        this.startedClickOnTextInput = false;

        this.savedScramblesArray = [];

        this.textAnchorX = windowWidth/2;
        this.textAnchorY = this.sizeOfText * 2; // Place the main display text 2 text-heights down from the top of the screen.        
        
        this.sketchFont = inputFont;
        this.usingMobile = inUsingMobile;
        this.usingAppleTouchDevice = inUsingAppleTouchDevice;
        this.textColor = inTextColor;

        this.startingString = "enter your scramble";
        this.scrambleMaxLength = 13;

        this.buttonsManagerRef;
        this.groupingText = false;
        this.groupCreationStartIndex = -1;
        this.groupCreationEndIndex = -1;

        this.lockingText = false;
        this.lockingIndex = -1;

        for(let i = 0; i < this.startingString.length; i++){
          this.charsArray.push(new TextChar(this.startingString.charAt(i)));
        }
        
        // What the heck, AT HIGHER RESOLUTIONS, making the width of the text box equal the number of characters and an equal number of gaps
        // makes the text align with the main display text. I had been using number of gaps as characters minus one accounts for gaps BETWEEN
        // characters, but if it aligns when the gaps equal the characters, I won't complain.
        // Needs more tweaking to get it to work at lower resolutions, but it's aligning at 1920 and 3840 wide.
        this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
        //this.textBoxWidth = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);
        this.textInputBoxWidth = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);

        

        // Info on Input Elements here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
        this.textInput = createInput(this.startingString);
        this.textInputOffsetY = this.sizeOfText * .82;
        //this.textInput.size(this.textInputBoxWidth + this.widthOfText/4);
        //this.textInput.size(windowWidth - this.widthOfText * 4);
        
        //this.textInput.size(this.textInputBoxWidth + this.widthOfText/4, this.sizeOfText);
        
        // print(textWidth(this.startingString) + textWidth(this.startingString.substring(0,2)));
        // print(this.startingString.length * (this.sizeOfText));
        // text(this.startingString, windowWidth/2, windowHeight /2);
        // rectMode(CENTER);
        // noStroke();
        // fill(textBoxBGColor);
        // rect(windowWidth, windowHeight, this.sizeOfText * 14, this.sizeOfText*4);

        // Make the textInput box as wide as the default string plus three characters,
        this.textInputBoxSizeX = (this.startingString.length+4) * (this.widthOfText);
        //let textInputBoxSizeX = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);
        if(this.usingMobile){
          this.textInputBoxSizeX = (this.startingString.length+3) * (this.widthOfText);
        }
        this.textInput.size(this.textInputBoxSizeX, this.sizeOfText);


        //this.textInput.size(textWidth(this.startingString) + textWidth(this.startingString.substring(0,2)), this.sizeOfText);
        
        //print("textSize is:" + this.sizeOfText);
        //print(this.textInput.size());
        this.textInput.elt.style.setProperty("text-align", "center");
        //this.textInput.position("center");
        //this.textInput.position(this.textAnchorX - (this.textInputBoxWidth + this.widthOfText/4) / 2, this.textAnchorY - this.textInputOffsetY);
        this.textInput.position(this.textAnchorX - this.textInput.width/2, this.textAnchorY - this.textInputOffsetY);
        // if(this.usingMobile && !this.usingAppleTouchDevice){
        //   this.textInput.position(this.textAnchorX - this.textInputBoxWidth/2, this.textAnchorY - this.textInputOffsetY);
        // }
        
        

        let sizeString = this.sizeOfText.toString() + "px";
        this.textInput.style('font-size', sizeString);
        this.textInput.style('font-family', 'CourierPrime-Regular');
        //this.textInput.style('color', 'rgba(0,0,0, 0.5)');  // Set font color to black and 50% opacity for default text.
        this.textInput.style('color', this.textColor);
        //this.textInput.style('background-color', 'rgb(255, 251, 161)');
        this.textInput.style('background-color', textBoxBGColor);
        this.textInput.style('border', '1');
        //this.textInput.style('font-kerning', 'none');
        //this.textInput.style('letter-spacing', '-1.4px');
        this.textInput.style('letter-spacing', '-1px');
        this.textInput.style('word-spacing', '-0.03em');
        this.textInput.style('white-space', '0em');
        this.textInput.id('textInputID');
        this.textInput.attribute('maxlength', this.scrambleMaxLength);
        this.textInput.style('min-width', this.textInput.width/2);
        this.textInput.style('max-width', this.textInput.width/2);
        //this.textInput.hide();

    }

    updateTextBoxWidth(){
      // this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
      
      // Make the textInput box as wide as the default string plus three characters,
      this.textInputBoxSizeX = (this.startingString.length+4) * (this.widthOfText);
      //let textInputBoxSizeX = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);
      if(this.usingMobile){
        this.textInputBoxSizeX = (this.startingString.length+3) * (this.widthOfText);
      }
      this.textInput.size(this.textInputBoxSizeX, this.sizeOfText);
      
    }

    updateProperties(){
      //background(220);
      // Update the main display scramble text.
      this.textAnchorX = windowWidth/2;
      this.textAnchorY = this.sizeOfText * 2;
      this.sizeOfText = windowWidth * this.textSizePercentage;
      this.widthOfText = this.sizeOfText/2;
      this.textGap = this.widthOfText / 6;
      this.updateTextBoxWidth();
      this.textInputBoxWidth = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);

      // Update the text input box
      //this.textInput.position(this.textAnchorX - this.textBoxWidth/2 - this.textGap/2, this.textAnchorY - this.textInputOffsetY);
      this.textInput.position(this.textAnchorX - (this.textInputBoxWidth + this.widthOfText/4) / 2, this.textAnchorY - this.textInputOffsetY);
      //this.textInput.size(this.textInputBoxWidth + this.widthOfText/4);
      //this.textInput.size(windowWidth - this.widthOfText * 4);
      //this.textInput.size(windowWidth * 2);    

      //this.textInput.size(this.textInputBoxWidth + this.widthOfText/4, this.sizeOfText);
      //this.textInput.size(textWidth(this.startingString) + textWidth(this.startingString.substring(0,2)), this.sizeOfText);
      // Make the textInput box as wide as the default string plus three characters,
      let textInputBoxSizeX = (this.startingString.length+4) * (this.widthOfText);
      //let textInputBoxSizeX = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);
      if(this.usingMobile){
        textInputBoxSizeX = (this.startingString.length+3) * (this.widthOfText);
      }
      this.textInput.size(textInputBoxSizeX, this.sizeOfText);
      
      //this.textInput.position("center");
      let sizeString = this.sizeOfText.toString() + "px";
      this.textInput.style('font-size', sizeString);
      

    }
    
    drawText(){
      // This centers the main text horizontally on the screen.
      this.updateTextBoxWidth();      
      let windowCenterTextOffsetX = this.textBoxWidth / 2;    
      textSize(this.sizeOfText);

      // Loop to draw saved scrambles.
      /*
      for(let i = 0; i < this.savedScramblesArray.length; i++){
        noStroke();
        fill(18, 21, 99);
        textAlign(CENTER, BASELINE);
        text(this.savedScramblesArray[i], this.textAnchorX, this.textAnchorY + this.sizeOfText * (2 + i));
        // This is a nice spot to draw the saved scramble deletion buttons.
        inButtonsManager.drawSavedScrambleDeletionButtons();
      }
      */

      let interactString = 'Click';
      if(this.usingMobile){
        interactString = 'Tap';
      }
      
      if(this.groupingText){
      //fill(166, 58, 72);
      fill(this.buttonsManagerRef.bracketColor);
      noStroke();
      textAlign(CENTER);
      textSize(this.sizeOfText / 2);
      if(this.usingMobile){
        textSize(this.sizeOfText / 1.75);
      }

      let groupingModeStatusText = interactString + ' and drag to create a group.\n' + interactString + ' a bracket to ungroup.';
      if(this.usingMobile && !this.usingAppleTouchDevice){
        groupingModeStatusText = interactString + ' to start a new group.\n' + interactString + ' a bracket to ungroup.';
      }
      // This will change the group mode status text to let users on android with the one click at a time
      // group creation know they need to tap again to set the end unit of their attempted group.
      //TODO
      // Maybe only display this for android, and for other devices show "drag to create group".
      if(this.groupCreationStartIndex >= 0 && this.groupCreationEndIndex == -1){
        groupingModeStatusText = 'Release to set group range.';
        if(this.usingMobile && !this.usingAppleTouchDevice){
          groupingModeStatusText = 'Tap again to set group range.';
        }
      }

      text(groupingModeStatusText, this.textAnchorX, this.textAnchorY + this.sizeOfText * 1);
      //return;
      }
      else if(this.lockingText){
      //fill(166, 58, 72);
      fill(this.buttonsManagerRef.lockColor);
      noStroke();
      textAlign(CENTER);
      textSize(this.sizeOfText / 2);
      if(this.usingMobile){
        textSize(this.sizeOfText / 1.75);
      }

      let lockingModeStatusText = interactString + ' a character or group\nto lock/unlock it.';
      // if(this.usingMobile){
      //   lockingModeStatusText = 'Tap a character or group\nto lock/unlock it.';
      // }
      text(lockingModeStatusText, this.textAnchorX, this.textAnchorY + this.sizeOfText * 1);
      }
        

      // this.buttonsManagerRef.drawTextCharButtons();

      /*
      for(let i = 0; i < this.charsArray.length; i++){      
        noStroke();
        if(this.defaultMessage)
          fill(this.textColor);
        else
          fill(this.textColor);
        textAlign(LEFT, BASELINE);
        text(this.charsArray[i].savedChar, this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + (i * this.textGap), this.textAnchorY + yOffset);
      

        
        // stroke(0,0,0);
        // strokeWeight(1);
        // line(this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + i * this.textGap,
        // 0, this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + i * this.textGap, windowHeight);
        
      }
      */

      
    }

    scrambleCharsArray(){
      let lowestIndex = 0;
      let randomIndex = 0;
      for(let i = lowestIndex; i < this.charsArray.length; i++){
          randomIndex = floor(random(lowestIndex, this.charsArray.length));
          this.charsArray.splice(0, 0, this.charsArray[randomIndex]);
          this.charsArray.splice(randomIndex+1, 1);
      }
      //this.setCharsArray(this.getCharsArrayAsString());
      this.reformGroups();
      this.fixLockedChars();
      this.updateTextCharButtonsArray();
    }

    getCharsArrayAsString(){
      let outString = "";
      for(let charsElement of this.charsArray){
        outString += charsElement.savedChar;
      }
      return outString;
    }

    textInputClickedOn(){
      let inputRect = document.getElementById('textInputID').getBoundingClientRect();
      if(inputRect.left == 0){
        return false;
      }
      else if(mouseX >= inputRect.left && mouseX <= inputRect.right && mouseY >= inputRect.top && mouseY <= inputRect.bottom){
        return true;
      }
    }

    // Erases the array and sets its contents to the input string's characters.
    setCharsArray(inString){
      this.charsArray.splice(0);  // This clears the main textChars array.
      // Reset the string to the default message if nothing was entered in the text input box.
      if(inString == ""){
        //let startingString = "type your scramble here";
        for(let i = 0; i < this.startingString.length; i++){
          this.charsArray.push(new TextChar(this.startingString.charAt(i)));
        }
        this.defaultMessage = true;
      }
      else{
        for(let i = 0; i < inString.length; i++){
          this.charsArray.push(new TextChar(inString.charAt(i)));
        }
      }
      this.updateTextCharButtonsArray();
    }

    updateTextCharButtonsArray(){
      // Set the textCharButtonsArray in the buttonsManager to have buttons with the same chars as charsArray
      this.updateTextBoxWidth();      
      // Start placing the text at the leftmost point of the calculated width of the entire text.
      let widthOfMainTextDisplay = this.charsArray.length * this.widthOfText + ((this.charsArray.length - 1)*this.textGap);
      let windowCenterTextOffsetX = widthOfMainTextDisplay / 2;

      this.buttonsManagerRef.textCharButtonsArray.splice(0);  // Clear the textChar buttons array and start a new one.

      for(let i = 0; i < this.charsArray.length; i++){
        // this.sizeOfText / 20 is trying to adjust for the slight offset of the drawn text and the textInputBox
        this.buttonsManagerRef.textCharButtonsArray.push(new Button(
          this.textAnchorX -windowCenterTextOffsetX + (i * this.widthOfText) + (i * this.textGap) + this.widthOfText/2,
          this.textAnchorY - this.sizeOfText/2 + this.sizeOfText / 20, this.widthOfText, "textChar"
        ));
        this.buttonsManagerRef.textCharButtonsArray[this.buttonsManagerRef.textCharButtonsArray.length - 1].savedScrambleText = this.charsArray[i].savedChar;
      }
    }

    setTextInputValue(){
      // Learned that fullString needed to be initialized as an empty string otherwise the first character was "undefined".
      let fullString = "";
      if(this.defaultMessage){
        this.defaultMessage = false;
      }
      else{
        this.defaultMessage = false;
        for(let i = 0; i < this.charsArray.length; i++){
          fullString += this.charsArray[i].savedChar;
        }
      }
      this.textInput.value(fullString);
      this.textInput.style('color', this.textColor);
    }

    clearInputTextValue(){
      let emptyString = "";
      this.textInput.value(emptyString);
      this.textInput.style('color', this.textColor);
    }

    saveScramble(inButtonsManager){
      // Max number of saved scrambles is 12.
      if(inButtonsManager.savedScrambleTextButtonsArray.length >= 12 || this.defaultMessage){
        //TODO
        // Maybe add some visual indication to the user that the max saves has been hit.
        // Or that they tried to save the default message.
        return;
      }    

      // How much to lower the saved scrambles array below the main text.
      // let savedTextYOffset = this.usingMobile ? 5 : -10;
      let savedTextYOffset = 2;
      
      if(this.usingMobile){
        savedTextYOffset = 5;
      }

      // Set the width of the text button depending on whether text is being edited or not.
      let textButtonWidth = this.getCharsArrayAsString().length * this.widthOfText + (this.getCharsArrayAsString().length - 1) * this.textGap;
      if(this.editingText)
        textButtonWidth = this.textInput.value().length * this.widthOfText + (this.textInput.value().length - 1) * this.textGap;
      
      // Add the text button to the savedTextButtonsArray
      inButtonsManager.savedScrambleTextButtonsArray.push(
        new Button(this.textAnchorX, this.textAnchorY + this.sizeOfText * (savedTextYOffset + inButtonsManager.savedScrambleTextButtonsArray.length),
        textButtonWidth, "savedScrambleText")
      );
      inButtonsManager.savedScrambleTextButtonsArray[inButtonsManager.savedScrambleTextButtonsArray.length - 1].textHeight = this.sizeOfText;
      // Set the saved scramble text depending on whether text is being edited or not.
      if(this.editingText)  
        inButtonsManager.savedScrambleTextButtonsArray[inButtonsManager.savedScrambleTextButtonsArray.length - 1].savedScrambleText = this.textInput.value();
      else
        inButtonsManager.savedScrambleTextButtonsArray[inButtonsManager.savedScrambleTextButtonsArray.length - 1].savedScrambleText = this.getCharsArrayAsString();

      // Add the corresponding deletion button
      // Make width of deletion square buttons equal to ~2 text characters.
      inButtonsManager.savedScrambleDeletionButtonsArray.push(
        new Button(this.textAnchorX + (textButtonWidth / 2) + (this.widthOfText * 1.5), 
        this.textAnchorY + this.sizeOfText * (savedTextYOffset + inButtonsManager.savedScrambleDeletionButtonsArray.length),
        this.widthOfText, "savedScrambleDeletion")        
      );
      

      this.adjustSavedButtonsXOffset(inButtonsManager);

    }

    // Called after a button is deleted, setting the remaining buttons Y (and X) positions accordingly.
    updateButtonPositions(inButtonsManager){
      let savedTextYOffset = 2;
      if(this.usingMobile){
        savedTextYOffset = 6;
      }

      for(let i  = 0; i < inButtonsManager.savedScrambleTextButtonsArray.length; i++){
        inButtonsManager.savedScrambleTextButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedTextYOffset + i);
        inButtonsManager.savedScrambleDeletionButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedTextYOffset + i);
      }
    }

    // Call at the end of saveScramble to put scrambles in columns and use the desktop's horizontal space.
    adjustSavedButtonsXOffset(inButtonsManager){     
      if(this.usingMobile)
          return;  // Only do the multiple saved scramble columns on desktop.

      let savedScrambleXOffset = windowWidth / 4;
      let savedScrambleYOffset = 2;

      // If scrambles are added beyond 6, split the saved scrambles into two columns.
      if(inButtonsManager.savedScrambleTextButtonsArray.length > 6){
        for(let i = 0; i < inButtonsManager.savedScrambleTextButtonsArray.length; i++){
          // Set the width of the text button based on the saved Scramble's text.
          let savedScrambleTextLength = inButtonsManager.savedScrambleTextButtonsArray[i].savedScrambleText.length;
          let textButtonWidth = savedScrambleTextLength * this.widthOfText + (savedScrambleTextLength - 1) * this.textGap;

          if(i < 6){
            inButtonsManager.savedScrambleTextButtonsArray[i].posX = this.textAnchorX - savedScrambleXOffset;
            inButtonsManager.savedScrambleTextButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedScrambleYOffset + i);

            inButtonsManager.savedScrambleDeletionButtonsArray[i].posX = this.textAnchorX + (textButtonWidth / 2) + (this.widthOfText * 1.5) - savedScrambleXOffset;
            inButtonsManager.savedScrambleDeletionButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedScrambleYOffset + i);
          }
          else if(i < 12){
            inButtonsManager.savedScrambleTextButtonsArray[i].posX = this.textAnchorX + savedScrambleXOffset;
            inButtonsManager.savedScrambleTextButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedScrambleYOffset + (i % 6));

            inButtonsManager.savedScrambleDeletionButtonsArray[i].posX = this.textAnchorX + (textButtonWidth / 2) + (this.widthOfText * 1.5) + savedScrambleXOffset;
            inButtonsManager.savedScrambleDeletionButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedScrambleYOffset + (i % 6));
          }
        }          
      }
      // This is the xPosition reset when removing saved scrambles (aka returning to one column).
      else if(inButtonsManager.savedScrambleTextButtonsArray.length <= 6){
        for(let i = 0; i < inButtonsManager.savedScrambleTextButtonsArray.length; i++){
          // Set the width of the text button based on the saved Scramble's text.
          let savedScrambleTextLength = inButtonsManager.savedScrambleTextButtonsArray[i].savedScrambleText.length;
          let textButtonWidth = savedScrambleTextLength * this.widthOfText + (savedScrambleTextLength - 1) * this.textGap;

          inButtonsManager.savedScrambleTextButtonsArray[i].posX = this.textAnchorX;
          inButtonsManager.savedScrambleTextButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedScrambleYOffset + i);

          inButtonsManager.savedScrambleDeletionButtonsArray[i].posX = this.textAnchorX + (textButtonWidth / 2) + (this.widthOfText * 1.5);
          inButtonsManager.savedScrambleDeletionButtonsArray[i].posY = this.textAnchorY + this.sizeOfText * (savedScrambleYOffset + i);
        }
      }
  }

  stopGroupCreation(){
    this.groupCreationStartIndex = -1;
    this.groupCreationEndIndex = -1;
  }

  // Use start and stop group creation indices to set a family of the characters between these two in the array
  createGroup(){
    // guard clause just to be safe from wrong index issues leading to trying to create an invalid group.
    if(this.groupCreationStartIndex == -1 || this.groupCreationEndIndex == -1){
      this.stopGroupCreation();
      return;
    }

    // Swap the start and stop indices if user created a family with a left-swipe
    if(this.groupCreationEndIndex < this.groupCreationStartIndex){
      let originalStart = this.groupCreationStartIndex;
      this.groupCreationStartIndex = this.groupCreationEndIndex;
      this.groupCreationEndIndex = originalStart;
    }

    // Check that there aren't any existing group members in the range of the current drag. If there are, abandon group creation.
    // Also check if any of the characters in the attempted range are locked, if so, also abandon group creation.
    // TODO
    // When abandoning group creation due to hitting conditions like these that prevent it, start a shaking animation to further
    // indicate that action isn't supported.
    for(let i = this.groupCreationStartIndex; i <= this.groupCreationEndIndex; i++){
      if(this.charsArray[i].groupID >= 0 || this.charsArray[i].isLocked){
        this.stopGroupCreation();
        return;
      }
    }

    // find the next available lowest familyID value
    let tempGroupID = 0;
    for(let i = 0; i < this.charsArray.length; i++){
      // If an ID of the current testing value was found, increment the testing ID and start the search over.
      if(this.charsArray[i].groupID == tempGroupID){
        tempGroupID++;
        i = -1;
      }
    }

    // Now that the lowest available group ID is set, apply it to the textChars in the start and end range
    // Also set the group order and size for each
    let groupSizeValue = (this.groupCreationEndIndex - this.groupCreationStartIndex) + 1;
    let groupOrderTracker = 0;  // The value for the head of the group.

    // Set all group-related properties of the relevant textChars
    for(let i = this.groupCreationStartIndex; i <= this.groupCreationEndIndex; i++){
      this.charsArray[i].groupID = tempGroupID;
      this.charsArray[i].groupSize = groupSizeValue;
      this.charsArray[i].groupOrder = groupOrderTracker;
      // print('created group consisting of: ' + this.charsArray[i].savedChar + ' at: ' + i + ' with groupID: ' + this.charsArray[i].groupID + 
      // ' group size: ' + this.charsArray[i].groupSize + ' and groupOrder: ' + this.charsArray[i].groupOrder);
      groupOrderTracker++;
    }

    this.updateRelativePositions();  // Reset all relative positions to account for changes in relative order for locked characters.
    this.buttonsManagerRef.resetTextCharButtonsBGs();
  }

  // Returns the group the mouse is hovering in addition to highlighting that group's bracket.
  checkGroupDeletion(){
    // see if we are in grouping mode and that there is some saved text, otherwise no textChars to draw positions from
    if(this.groupingText == false || this.defaultMessage == true || this.editingText){
      return -1;
    }

    
    let halfDiameter = this.buttonsManagerRef.textCharButtonsArray[0].diameter / 2;
    let leftBound = this.buttonsManagerRef.textCharButtonsArray[0].posX - halfDiameter;
    let rightBound = this.buttonsManagerRef.textCharButtonsArray[this.buttonsManagerRef.textCharButtonsArray.length - 1].posX + halfDiameter;
    let topBound = this.buttonsManagerRef.textCharButtonsArray[0].posY + (2*halfDiameter);
    let bottomBound = this.buttonsManagerRef.textCharButtonsArray[0].posY + (4*halfDiameter);
    let xCenter = leftBound + (rightBound - leftBound) / 2;
    let yCenter = topBound + (bottomBound - topBound) / 2;
    rectMode(CENTER);
    noFill();
    stroke(0,255,0);
    strokeWeight(2);  

    // check if mouse is in the area that could contain group brackets and also the area to click to break a group.
    // Testing out using a guard/escape clause instead of doing too many nested if blocks.
    if(mouseX < leftBound || mouseX > rightBound || mouseY < topBound || mouseY > bottomBound){
      return -1;
    }

    // Debugging: draw a box around the area that could be clicked in to destroy a group
    //rect(xCenter, yCenter, rightBound - leftBound, bottomBound - topBound);    

    // check which specific group is being hovered over by comparing to the group status and left and right bounds of the hovered-over character
    for(let i = 0; i < this.charsArray.length; i++){
      //let foundGroupID = -1;
      // Look for a group head, then check if the mouse in that head's group under-area.
      if(this.charsArray[i].groupOrder == 0){
        leftBound = this.buttonsManagerRef.textCharButtonsArray[i].posX - halfDiameter;
        let groupEndIndex = i + (this.charsArray[i].groupSize - 1);
        rightBound = this.buttonsManagerRef.textCharButtonsArray[groupEndIndex].posX + halfDiameter;

        if(mouseX >= leftBound && mouseX <= rightBound){
          //circle(windowWidth / 2, windowHeight * .75, windowWidth / 5);
          // Draw the bracket as red.
          this.buttonsManagerRef.drawGroupBracket(i, this.charsArray[i].groupSize, 'rgb(255, 25, 25)', true);
          // TODO
          // Draw the red deletion X here over the middle of the group. Maybe also make the bracket red while hovering over?
          return this.charsArray[i].groupID;
        }
      }
    }

    return -1;

  }

  dismantleGroup(inGroupID){
    for(let i = 0; i < this.charsArray.length; i++){
      if(this.charsArray[i].groupID == inGroupID){
        this.charsArray[i].groupID = -1;
        this.charsArray[i].groupSize = 0;
        this.charsArray[i].groupOrder = -1;
      }
    }
    this.updateRelativePositions();  // Reset all relative positions to account for changes in relative order for locked characters.
    this.buttonsManagerRef.resetTextCharButtonsBGs();
  }

  reformGroups(){
    // Look for a group head.
    for(let i = 0; i < this.charsArray.length; i++){
      // If you found a group head, look for its body members as many times as the group's size requires.
      if(this.charsArray[i].groupOrder == 0){
        let foundGroupID = this.charsArray[i].groupID;
        //let groupMemberCounter = 1;
        let foundGroupSize = this.charsArray[i].groupSize;
        let workingIndex = i;

        // If the group is in order, move to the next character in the search for group heads.
        if(this.groupOrderCheck(workingIndex, foundGroupSize, foundGroupID)){
          continue;
        }

        // Iterate through the charsArray once per member of the group excluding the head.
        for(let groupMemberCounter = 1; groupMemberCounter < foundGroupSize; groupMemberCounter++){
          // Search through the charsArray for the next group member with the criteria:
          // same groupID, next in the group (groupMemberCounter), the group member is not in its right position (workingIndex+1)
          let properIndex = workingIndex + groupMemberCounter;
          for(let k = 0; k < this.charsArray.length; k++){
            // If we found a member of the same group, it is the next member of the group, and it is NOT in the right position (at i + group#)
            // splice() it into position, remove the old instance, and proceed to the next member in the group.
            if(this.charsArray[k].groupID == foundGroupID && this.charsArray[k].groupOrder == groupMemberCounter && k != properIndex){
              // place the found textChar at k at the intended position of workingIndex (i) + 1, aka to the right of the previous member of the group.
              this.charsArray.splice(properIndex, 0, this.charsArray[k]);
              // Now remove the old instance of the group member.
              // If it was originally to the right of the intended spot, remove the element at found + 1.
              if(k > properIndex){
                this.charsArray.splice(k + 1, 1);
              }
              // If it was originally to the left of the intended spot, remove the element at the found spot.
              else if(k < properIndex){
                this.charsArray.splice(k, 1);
                workingIndex--;
              }
              // Reset the overall search if a group was finished being reordered.
              if(groupMemberCounter == foundGroupSize - 1)
                i = -1;

            }
          }
          
        }
        
      }

    }
  }

  // Check the characters next to the found group head and see if it needs to be iterated through to fix the group.
  groupOrderCheck(startingPosition, sizeOfGroup, inputID){
    // If the group head is in the last index of the array, it is out of order because there is no room to check for the chars
    // that are supposed to be to its right. Had to make this early return otherwise an out of bounds index could be attempted.
    if(startingPosition > (this.charsArray.length - 1) - (sizeOfGroup - 1)){
      return false;
    }
    let orderCount = 1;
    // The problem was that the index where a group is started at can be less than the size of the group.
    // Needed to set the range to check as the starting position through the starting position + group size (-1 for index at 0).
    for(let i = startingPosition + 1; i <= startingPosition + (sizeOfGroup-1); i++){     
      // If an index out of bounds of the array is attempted to be indexed, return false
      // because it means that the group head is too close to the end of the array to fit the size of its group.
      if(i >= this.charsArray.length){
        return false;
      }
      
      if(this.charsArray[i].groupID != inputID || this.charsArray[i].groupOrder != orderCount){
        return false;      
      }
      orderCount++;
    }
    return true;
  }

  // Call this after making and destroying groups to update the relative positions of all groups, especially locked groups.
  updateRelativePositions(){
    let relPosTracker = -1;
    for(let i = 0; i < this.charsArray.length; i++){
      // If we found a single character or a group head, increment the relative position.
      if(this.charsArray[i].groupOrder <= 0){
        relPosTracker++;
      }
      if(this.charsArray[i].isLocked){
        this.charsArray[i].relativePos = relPosTracker;
      }
    }
  }

  toggleCharLock(){
    let relPosTracker = -1;
    // Iterate through the charsArray, incrementing relPosTracker each time a non-grouped or group head is encountered.
    for(let i = 0; i < this.charsArray.length; i++){
      // Increment the relativePosition tracker that only counts ungrouped or heads of grouped units, aka groupOrder -1 or 0.
      if(this.charsArray[i].groupOrder <= 0){
        relPosTracker++;
      }

      // If the index was found that is the currently checking lockingIndex, attempt to toggle the lock for the char or its group.
      if(i == this.lockingIndex){
        // If a member of a group (head or body) is being checked, find that group in a new search and toggle the locked status of
        // all chars with the same groupID.
        if(this.charsArray[i].groupID >= 0){
          for(let j = 0; j < this.charsArray.length; j++){      
            if(this.charsArray[j].groupID == this.charsArray[this.lockingIndex].groupID ){
              this.charsArray[j].isLocked = !this.charsArray[j].isLocked;
              // Set relativePos to tracker if the char was just set to locked, otherwise reset it to default.
              if(this.charsArray[j].isLocked){
                this.charsArray[j].relativePos = relPosTracker;
                // print('set ' + this.charsArray[j].savedChar + '\'s relative Position as: ' + relPosTracker);
              }
              else{
                this.charsArray[j].relativePos = -1;
              }
            }
          }
        }
        // Otherwise toggle the lock of the single char.
        // Set relativePos to tracker if the char was just set to locked, otherwise reset it to default.
        else{
          this.charsArray[i].isLocked = !this.charsArray[i].isLocked;
          if(this.charsArray[i].isLocked){
            this.charsArray[i].relativePos = relPosTracker;
          }
          else{
            this.charsArray[i].relativePos = -1;
          }
        }
      }
    }
    this.lockingIndex = -1; // reset this as it is the working variable for a clicked-on character.
    this.buttonsManagerRef.resetTextCharButtonsBGs();
  }

  fixLockedChars(){
    // print('charsArray before fixing locked chars: ' + this.getCharsArrayAsString());
    let relPosCheck = -1;
    for(let i = 0; i < this.charsArray.length; i++){
      //print('Found ' + this.charsArray[i].savedChar);
      // Increment relPos check if this char is not a body of a group. Only counting single chars and group heads to
      // determine the order to return locked characters to the array in.
      if(this.charsArray[i].groupOrder <= 0){
        //print('this is a group head or single character, so incrementing relPosCheck');
        relPosCheck++;
        //print('current relative position is ' + relPosCheck);
      }
      // If a character is found to be locked and not in its relative position, return it to its relative position.
      if(this.charsArray[i].isLocked && this.charsArray[i].relativePos != relPosCheck){
        if(this.charsArray[i].groupID >= 0){
          // print('group starting with ' + this.charsArray[i].savedChar + ' has a relative position of: ' + this.charsArray[i].relativePos);
        }
        else{
          // print('locked char ' + this.charsArray[i].savedChar + ' has a relative position of: ' + this.charsArray[i].relativePos);
        }
        
        // print('found ' + this.charsArray[i].savedChar + ' at index: ' + i + ' instead of ' + this.findRelativePosIndex(this.charsArray[i].relativePos, false));

        // If placing elements that are in a group, place each of the members of the group in order
        //if(this.charsArray[i].groupOrder == )

        // Search for the absolute index of the relative position stored for that locked character.
        let placementIndex = this.findRelativePosIndex(this.charsArray[i].relativePos, true);
        
        // If the char is to be place at the end of the array, the placement step puts the character at placement + 1, so
        // change the placementIndex to be charsArray.length - 1 to place it at the end when 1 is added.
        // if(placementIndex + 1 > this.charsArray.length - 1){
          
        //   placementIndex = this.charsArray.length - 1;
        // }

        // If the found misplaced locked character is the head of a group, move the whole group instead of just one char.
        if(this.charsArray[i].groupOrder == 0){
          //let sizeOfFoundGroup = this.charsArray[i].groupSize;

          //TODO
          // May have to check placing index and whether it is in a group or not and have to keep searching for valid index.
          this.moveCharGroup(i, placementIndex);
          // print('charsArray after fixing one charGroup: ' + this.getCharsArrayAsString() + '.');
          // print('-');
          // After moving a character, start the search over from the beginning in chars were moved around.
          relPosCheck = -1;
          i = -1;
        }
        else if(this.charsArray[i].groupOrder == -1){
          // print('attempting to place ' + this.charsArray[i].savedChar + ' at ' + placementIndex);
          // Remove the old incorrectly placed character.
          this.moveChar(i, placementIndex);
          // print('charsArray after fixing one char: ' + this.getCharsArrayAsString() + '.');
          // After moving a character, start the search over from the beginning in chars were moved around.
          // print('starting lock fixing over.\n***');
          relPosCheck = -1;
          i = -1;
        }

      }
    }

    // print('charsArray after fixing locked chars: ' + this.getCharsArrayAsString() + '.\n|\n|\n|\n');
  }

  findRelativePosIndex(inRelPos, report){
    let trackingRelPos = -1;
    // Iterate through the array to find the index that corresponds to the desired relativePos that is put into this method.
    for(let i = 0; i < this.charsArray.length; i++){
      // Only increment the current relativePos
      if(this.charsArray[i].groupOrder <= 0){
        trackingRelPos++;
      }
      // If we have finally landed on the desired relative Position, return the current index which corresponds to the relativePos
      if(trackingRelPos == inRelPos && this.charsArray[i].groupOrder <= 0){
        if(report){
          // print('found the intended relative position index: ' + i);
        }
        return i;
      }
 
    }
    return -1; // Default to returning to the first index, but this is not ideal.
  }

  moveChar(foundIndex, goalIndex){
    // Remove the old incorrectly placed character.
    if(foundIndex > goalIndex){
      // print('placing ' + this.charsArray[foundIndex].savedChar + ' at ' + (goalIndex));
      this.charsArray.splice(goalIndex, 0, this.charsArray[foundIndex]);
      // print('removing ' + this.charsArray[foundIndex + 1].savedChar + ' at ' + (foundIndex + 1));
      this.charsArray.splice(foundIndex + 1, 1);
    }
    else if(foundIndex < goalIndex){
      // Adjust the goalIndex if the goalIndex contains a group (head). Normally it's +1 of the index to account
      // for having to delete the original found index, but that +1 is shifted by the size of the found group minus 1 (zero indexing) now.
      if(this.charsArray[goalIndex].groupID >= 0){
        // print('found a group starting with ' + this.charsArray[goalIndex + 1].savedChar + ' at index: ' + goalIndex);
        // If the goal index is the head of a group, to add one unit "to the right" of the group, the goal index needs to be
        // shifted by the size of the group, then add 1 to the index.
        goalIndex += this.charsArray[goalIndex].groupSize - 1;        
      }
      // print('placing ' + this.charsArray[foundIndex].savedChar + ' at ' + (goalIndex));
      // Increment the goal (placement) by 1 when the found location is to the left of the goal location.      
      this.charsArray.splice(goalIndex + 1, 0, this.charsArray[foundIndex]);
      // print('removing ' + this.charsArray[foundIndex].savedChar + ' at ' + (foundIndex));
      this.charsArray.splice(foundIndex, 1);
    }

    // print('charsArray after moving this one character: ' + this.getCharsArrayAsString());
  }

  moveCharGroup(foundIndex, goalIndex){
    let sizeOfFoundGroup = this.charsArray[foundIndex].groupSize;
    if(foundIndex > goalIndex){
      for(let i = 0; i < sizeOfFoundGroup; i++){
        // print('placing ' + this.charsArray[foundIndex+2 * i].savedChar + ' at ' + (goalIndex+i));
        // update where is is reading in the textChar to copy from
        this.charsArray.splice(goalIndex+i, 0, this.charsArray[foundIndex + 2 * i]);
      }
      // print('charsArray after adding locked chars to goalIndex: ' + this.getCharsArrayAsString() + '.');
      // print('removing group starting with ' + this.charsArray[foundIndex + sizeOfFoundGroup].savedChar + ' at ' + (foundIndex + sizeOfFoundGroup));
      this.charsArray.splice(foundIndex + sizeOfFoundGroup, sizeOfFoundGroup);
          
    }
    else if(foundIndex < goalIndex){
      // Adjust the goalIndex if the goalIndex contains a group (head)
      // if(goalIndex + 1 < this.charsArray.length && this.charsArray[goalIndex + 1].groupID >= 0){
      //   goalIndex += this.charsArray[goalIndex + 1].groupSize;
      // }
      // else{
      //   goalIndex++;
      // }
      if(this.charsArray[goalIndex].groupID >= 0){
        goalIndex += this.charsArray[goalIndex].groupSize - 1;
      }

      for(let i = 0; i < sizeOfFoundGroup; i++){
        // print('placing ' + this.charsArray[foundIndex+i].savedChar + ' at ' + (goalIndex+i));
        this.charsArray.splice(goalIndex + 1 + i, 0, this.charsArray[foundIndex + i]);
      }
      // print('removing group starting with' + this.charsArray[foundIndex].savedChar + ' at ' + (foundIndex));
      this.charsArray.splice(foundIndex, sizeOfFoundGroup);
    }

  }

  deleteAllSavedScrambles(){
    this.savedScramblesArray.splice(0);
  }

  resetTextInputPosition(){
    this.textInput.position(this.textAnchorX - this.textInput.width/2, this.textAnchorY - this.textInputOffsetY);
  }

}

