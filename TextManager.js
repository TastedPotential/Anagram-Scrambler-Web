class TextManager{

    constructor(inputFont, inputTextSizePercentage, inUsingMobile, textBoxBGColor, inTextColor){
        this.charsArray = [];
        this.textSizePercentage = inputTextSizePercentage;
        this.sizeOfText = windowWidth * this.textSizePercentage;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = this.widthOfText / 6; // divide by 6 for CourierPrime 20 for default monospace, 9 for SpaceMono, 0 value for SomeType (not needed)
        this.editingText = true;
        this.defaultMessage = true; // This changes after the user adds ANY characters to be scrambled. It is reset if the user deletes all text in the input box.
        this.startedClickOnTextInput = false;

        this.savedScramblesArray = [];

        this.textAnchorX = windowWidth/2;;
        this.textAnchorY = this.sizeOfText * 2; // Place the main display text 2 text-heights down from the top of the screen.        
        
        this.sketchFont = inputFont;
        this.usingMobile = inUsingMobile;
        this.textColor = inTextColor;

        this.startingString = "type your scramble here";
        this.scrambleMaxLength = 13;

        this.buttonsManagerRef;
        this.groupingText = false;
        this.groupCreationStartIndex = -1;
        this.groupCreationEndIndex = -1;

        this.lockingText = false;

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
        this.textInput.size(this.textInputBoxWidth + this.widthOfText/4, this.sizeOfText);
        //print("textSize is:" + this.sizeOfText);
        //print(this.textInput.size());
        this.textInput.elt.style.setProperty("text-align", "center");
        //this.textInput.position("center");
        this.textInput.position(this.textAnchorX - (this.textInputBoxWidth + this.widthOfText/4) / 2, this.textAnchorY - this.textInputOffsetY);
        

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
        //this.textInput.hide();

    }

    updateTextBoxWidth(){
      this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
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
      this.textInput.size(this.textInputBoxWidth + this.widthOfText/4, this.sizeOfText);
      
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
      
       if(this.groupingText){
        fill(166, 58, 72);
        noStroke();
        textAlign(CENTER);
        textSize(this.sizeOfText / 2);
        text("grouping mode active", this.textAnchorX, this.textAnchorY - this.sizeOfText * 1.5);
        //return;
       }
       else if(this.lockingText){
        fill(166, 58, 72);
        noStroke();
        textAlign(CENTER);
        textSize(this.sizeOfText / 2);
        text("locking mode active", this.textAnchorX, this.textAnchorY - this.sizeOfText * 1.5);
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
      this.charsArray.splice(0);  // This clears the array.
      // Reset the string to the default message if nothing was entered in the text input box.
      if(inString == ""){
        let startingString = "type your scramble here";
        for(let i = 0; i < startingString.length; i++){
          this.charsArray.push(new TextChar(startingString.charAt(i)));
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
      let windowCenterTextOffsetX = this.textBoxWidth / 2;

      this.buttonsManagerRef.textCharButtonsArray.splice(0);
      for(let i = 0; i < this.charsArray.length; i++){
        // this.sizeOfText / 20 is trying to adjust for the slight offset of the drawn text and the textInputBox
        this.buttonsManagerRef.textCharButtonsArray.push(new Button(
          this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + (i * this.textGap) + this.widthOfText/2,
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
      if(inButtonsManager.savedScrambleTextButtonsArray.length >= 12){
        // Maybe add some visual indication to the user that the max saves has been hit.
        return;
      }    

      let savedTextYOffset = 2;
      if(this.usingMobile){
        savedTextYOffset = 6;
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
    for(let i = this.groupCreationStartIndex; i <= this.groupCreationEndIndex; i++){
      if(this.charsArray[i].groupID >= 0){
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

}