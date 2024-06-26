class ButtonsManager{
    constructor(inputTextManager, inButtonSizePercentage, isMobileDevice, isTouchDevice){
        this.buttonDiameterFactor = inButtonSizePercentage;
        this.buttonDiameter = windowWidth * this.buttonDiameterFactor;

        this.buttonOffsetX = inputTextManager.sizeOfText;
        this.buttonOffsetY = inputTextManager.sizeOfText / 4;
        this.usingMobile = isMobileDevice;
        this.usingTouchDevice = isTouchDevice;

        let saveButtonOffsetX = inputTextManager.sizeOfText * 1.25;
        if(this.usingMobile == true){
            this.buttonOffsetX = -inputTextManager.sizeOfText;
            this.buttonOffsetY = -inputTextManager.sizeOfText * 3.25;
            saveButtonOffsetX = -inputTextManager.textInputBoxSizeX / 2 - this.buttonOffsetX;   // this will place it in the middle on mobile.
        }

        this.scrambleButton = new Button(inputTextManager.textAnchorX - inputTextManager.textInputBoxSizeX / 2 - this.buttonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "scramble", this.usingMobile);

        this.editButton = new Button(inputTextManager.textAnchorX + inputTextManager.textInputBoxSizeX / 2 + this.buttonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "edit", this.usingMobile);

        this.saveButton = new Button(inputTextManager.textAnchorX - inputTextManager.textInputBoxSizeX / 2 - this.buttonOffsetX - saveButtonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "save", this.usingMobile);

        // Lock and Group button block

        this.groupButton = new Button(this.editButton.posX + this.buttonDiameter * 1.20, this.editButton.posY, this.buttonDiameter, "group", this.usingMobile);
        
        this.lockButton = new Button(this.editButton.posX + this.buttonDiameter * 2.40, this.editButton.posY, this.buttonDiameter, "lock", this.usingMobile);

        let scrambleEditXGap = this.editButton.posX - this.scrambleButton.posX;

        if(this.usingMobile){
            this.groupButton = new Button(this.scrambleButton.posX + scrambleEditXGap*.25, this.scrambleButton.posY, this.buttonDiameter, "group", this.usingMobile);
            this.lockButton = new Button(this.editButton.posX - scrambleEditXGap*.25, this.editButton.posY, this.buttonDiameter, "lock", this.usingMobile);            
        }

        this.savedScrambleDeletionButtonsArray = [];
        this.savedScrambleTextButtonsArray = [];
        this.textCharButtonsArray = [];

        this.clickedCharIndex = -1;

        this.textManagerRef = inputTextManager;
        // this.bracketColor = 'rgb(163, 64, 201)';
        this.bracketColor = 'rgb(178, 85, 250)';
        this.bgColor = 'rgb(55, 67, 117)';
        //this.lockColor = 'rgb(255, 25, 25)';
        //this.lockColor = 'rgb(37, 151, 217)';
        //this.lockColor = 'rgb(66, 200, 227)';
        //this.lockColor = 'rgb(245, 242, 83)';
        this.lockColor = 'rgb(230, 216, 73)';

        // Place delete all scrambles button in bottom left one text unit away from the corner.
        //this.deleteAllButton = new Button(windowWidth - this.buttonDiameter, 0 + this.buttonDiameter, this.buttonDiameter, "deleteAll", this.usingMobile);
        let deleteAllXPos = isTouchDevice ? this.buttonDiameter * .7 : this.lockButton.posX;
        let deleteAllYPos = isTouchDevice ? windowHeight - this.buttonDiameter * .6 : this.buttonDiameter * .6;
        // deleteAllXPos = windowWidth - this.buttonDiameter * .6;
        // deleteAllYPos = 0 + this.buttonDiameter * .6;
        this.deleteAllButton = new Button(deleteAllXPos, deleteAllYPos, this.buttonDiameter, "deleteAll", this.usingMobile);
    }

    drawButtons(inGroupUnderMouse){
        this.scrambleButton.drawButton();
        this.editButton.drawButton();
        if(!this.textManagerRef.defaultMessage && this.textManagerRef.textInput.value() != ''){
            this.saveButton.drawButton();
        }        
        this.drawSavedScrambleTextButtons();
        this.drawSavedScrambleDeletionButtons();

        if(!this.usingMobile && this.savedScrambleTextButtonsArray.length > 0){
            this.deleteAllButton.drawButton();
        }
        
        if(this.textManagerRef.editingText == false){
            this.groupButton.drawButton();
            this.lockButton.drawButton();
            // Draw a lock on the lock button
            this.drawLock(this.lockButton.posX, this.lockButton.posY + this.lockButton.diameter * .06, this.lockButton.buttonIconColor, true);
            this.drawTextCharButtons();
            this.drawGroupLines(inGroupUnderMouse);// draw group lines
            // draw locks/brackets
            this.drawCharLocks();
        }

    }

    updateProperties(inputTextManager){
        this.buttonDiameter = windowWidth * this.buttonDiameterFactor;

        this.buttonOffsetX = inputTextManager.sizeOfText;
        this.buttonOffsetY = inputTextManager.sizeOfText / 4;

        let saveButtonOffsetX = inputTextManager.sizeOfText * 1.25;
        // Mobile layout version of button adjusting.
        if(this.usingMobile == true){
            this.buttonOffsetX = -inputTextManager.sizeOfText;
            this.buttonOffsetY = -inputTextManager.sizeOfText * 3;
            saveButtonOffsetX = -inputTextManager.textInputBoxSizeX / 2 - this.buttonOffsetX;   // this will place it in the middle on mobile.

            this.scrambleButton.posX = inputTextManager.textAnchorX - inputTextManager.textInputBoxSizeX / 2 - this.buttonOffsetX;
            this.scrambleButton.posY = inputTextManager.textAnchorY - this.buttonOffsetY;
            this.scrambleButton.diameter = this.buttonDiameter;

            this.editButton.posX = inputTextManager.textAnchorX + inputTextManager.textInputBoxSizeX / 2 + this.buttonOffsetX;
            this.editButton.posY = inputTextManager.textAnchorY - this.buttonOffsetY;
            this.editButton.diameter = this.buttonDiameter;

            this.saveButton.posX = inputTextManager.textAnchorX - inputTextManager.textInputBoxSizeX / 2 - this.buttonOffsetX - saveButtonOffsetX;
            this.saveButton.posY = inputTextManager.textAnchorY - this.buttonOffsetY;
            this.saveButton.diameter = this.buttonDiameter;

            // Lock and Group button block

            let scrambleEditXGap = this.editButton.posX - this.scrambleButton.posX;

            this.groupButton.posX = this.scrambleButton.posX + scrambleEditXGap*.25;
            this.groupButton.posY = this.scrambleButton.posY;
            this.groupButton.diameter = this.buttonDiameter;

            this.lockButton.posX = this.editButton.posX - scrambleEditXGap*.25;
            this.lockButton.posY = this.editButton.posY;
            this.lockButton.diameter = this.buttonDiameter;

            this.deleteAllButton.posX = windowWidth - this.buttonDiameter;
            this.deleteAllButton.posY = windowHeight - this.buttonDiameter;
            this.deleteAllButton.diameter = this.buttonDiameter;

            return;
        }
        
        this.scrambleButton.posX = inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - this.buttonOffsetX;
        this.scrambleButton.posY = inputTextManager.textAnchorY - this.buttonOffsetY;
        this.scrambleButton.diameter = this.buttonDiameter;

        this.editButton.posX = inputTextManager.textAnchorX + inputTextManager.textBoxWidth / 2 + this.buttonOffsetX;
        this.editButton.posY = inputTextManager.textAnchorY - this.buttonOffsetY;
        this.editButton.diameter = this.buttonDiameter;

        this.saveButton.posX = inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - this.buttonOffsetX - saveButtonOffsetX;
        this.saveButton.posY = inputTextManager.textAnchorY - this.buttonOffsetY;
        this.saveButton.diameter = this.buttonDiameter;

        this.groupButton.posX = this.editButton.posX + this.buttonDiameter * 1.20;
        this.groupButton.posY = this.editButton.posY;
        this.groupButton.diameter = this.buttonDiameter;

        this.lockButton.posX = this.editButton.posX + this.buttonDiameter * 2.40;
        this.lockButton.posY = this.editButton.posY;
        this.lockButton.diameter = this.buttonDiameter;

        
        this.deleteAllButton.posX = this.lockButton.posX;
        this.deleteAllButton.posY = this.buttonDiameter * .6;
        this.deleteAllButton.diameter = this.buttonDiameter;

        //TODO
        // Update savedScrambleTextButtonsArray and savedScrambleDeletionButtonsArray sizes.
        // Update textCharButtons sizes
    }

    drawSavedScrambleDeletionButtons(){
        for(let i = 0; i < this.savedScrambleDeletionButtonsArray.length; i++){
            this.savedScrambleDeletionButtonsArray[i].drawButton();
            
        }
    }

    drawSavedScrambleTextButtons(){
        for(let i = 0; i < this.savedScrambleTextButtonsArray.length; i++){
            this.savedScrambleTextButtonsArray[i].drawButton();
        }        
        // Draw the deleteAll saved scrambles button to the left of the last saved scramble.
        // Do this by setting the posY of the deleteAll button to be the same as the last (or only) saved scramble's posY.
        if(this.usingTouchDevice && this.savedScrambleTextButtonsArray.length > 0){
            // // this.deleteAllButton.posY = this.savedScrambleTextButtonsArray[this.savedScrambleTextButtonsArray.length - 1].posY;
            // // Instead going to draw the delete all button next to the first/topmost saved scramble. I prefer all the UI buttons close to one another.
            // this.deleteAllButton.posY = this.savedScrambleTextButtonsArray[0].posY;
            // // Max possible width of a saved scramble is:
            // let maxWidth = (this.textManagerRef.scrambleMaxLength * this.textManagerRef.widthOfText) +
            // ((this.textManagerRef.scrambleMaxLength - 1) * this.textManagerRef.textGap);
            // // Get the midpoint of the left of the widest possible scramble and the left edge of the screen.
            // this.deleteAllButton.posX = ((width/2) - (maxWidth / 2))/2;
            // this.deleteAllButton.drawButton();  // Only draw delete all button when there are saved scrambles.


            // Draw the delete all scrambles button centered underneath the last saved scramble.
            this.deleteAllButton.posY = this.savedScrambleTextButtonsArray[this.savedScrambleTextButtonsArray.length - 1].posY
            + (this.deleteAllButton.diameter * 1.15);
            this.deleteAllButton.posX = width / 2;
            this.deleteAllButton.drawButton();

            // Max possible width of a saved scramble is:
            let maxWidth = (this.textManagerRef.scrambleMaxLength * this.textManagerRef.widthOfText) +
            ((this.textManagerRef.scrambleMaxLength - 1) * this.textManagerRef.textGap);

            // Draw delete all button bracket.
            strokeWeight(this.buttonDiameter/20);
            stroke(this.deleteAllButton.buttonFillColor);
            line(this.deleteAllButton.posX - maxWidth / 2, this.deleteAllButton.posY,
            this.deleteAllButton.posX - this.deleteAllButton.diameter * 0.75, this.deleteAllButton.posY);
            line(this.deleteAllButton.posX + this.deleteAllButton.diameter * 0.75, this.deleteAllButton.posY,
            this.deleteAllButton.posX + maxWidth / 2, this.deleteAllButton.posY);
            // Vertical bars.
            let barHeight = this.deleteAllButton.diameter * .20;
            line(this.deleteAllButton.posX - maxWidth / 2, this.deleteAllButton.posY,
            this.deleteAllButton.posX - maxWidth / 2, this.deleteAllButton.posY - barHeight);
            line(this.deleteAllButton.posX + maxWidth / 2, this.deleteAllButton.posY,
            this.deleteAllButton.posX + maxWidth / 2, this.deleteAllButton.posY - barHeight);

            

            
        }
        
    }
    
    drawTextCharButtons(){
        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            if(this.textManagerRef.lockingText){
                this.textCharButtonsArray[i].setHoverColor(this.lockColor);
            }
            else if(this.textManagerRef.groupingText){
                this.textCharButtonsArray[i].setHoverColor(this.bracketColor);
            }
            this.textCharButtonsArray[i].drawButton();
        }
    }
    
    resetTextCharButtonsBGs(){
        if((!this.usingTouchDevice))
            return;

        this.resetTextCharButtonHoverStatuses();
        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            this.textCharButtonsArray[i].setHoverColor(this.bgColor);
        }
    }

    resetTextCharButtonHoverStatuses(){
        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            this.textCharButtonsArray[i].isBeingHoveredOver = false;
        }
    }

    getIndexOfClickedChar(){
        let clickedIndex = -1;
        this.setHoverStatus();

        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            if(this.textCharButtonsArray[i].isBeingHoveredOver){
                clickedIndex = i;
            }
        }

        // Check if overlapping

        return clickedIndex;  // if no textChar was clicked on
    }

    // The main loop to draw all set families each frame.
    drawGroupLines(inGroupUnderMouse){
        let groupLineUnits = -1;
        for(let i = 0; i < this.textManagerRef.charsArray.length; i++){
            // ONLY if we found the HEAD of a group, draw a grouping bracket
            if(this.textManagerRef.charsArray[i].groupOrder == 0){
                // If the mouse is hovering over a bracket, don't draw this bracket until later in textManager.checkGroupDeletion().
                if(this.textManagerRef.charsArray[i].groupID != inGroupUnderMouse){
                    groupLineUnits = this.textManagerRef.charsArray[i].groupSize;
                    this.drawGroupBracket(i, groupLineUnits, this.bracketColor, false);
                }
            }
        }
    }

    drawGroupBracket(groupHeadIndex, groupUnitSize, inBracketColor, isDeleting){
        // The bracket will extend from the leftmost unit to the rightmost unit in the group.
        let groupEndIndex = groupHeadIndex + (groupUnitSize - 1);
        stroke(inBracketColor);
        strokeWeight(4);
        if(this.usingMobile){
            strokeWeight(2.5);
        }

        let groupLineYDrop = this.textCharButtonsArray[groupHeadIndex].diameter * 1.6;
        let charDiameter = this.textCharButtonsArray[groupHeadIndex].diameter / 2;
        let bracketHeight = charDiameter/4;

        let leftEndpointX = this.textCharButtonsArray[groupHeadIndex].posX - charDiameter;
        let leftEndpointY = this.textCharButtonsArray[groupHeadIndex].posY + groupLineYDrop;
        let rightEndPointX = this.textCharButtonsArray[groupEndIndex].posX + charDiameter;
        let rightEndpointY = this.textCharButtonsArray[groupEndIndex].posY + groupLineYDrop;
        let bracketWidth = rightEndPointX - leftEndpointX;
        //TODO
        // Change this so the gap isn't dependent on the width of the bar, otherwise it draws a bigger gap for larger groups.
        let bracketCentralOffset = (bracketWidth * 0.5) - (charDiameter *.75);
        let deletionXWidth = charDiameter * 0.5;
        let deletionXHorizontalCenter = (rightEndPointX - leftEndpointX) / 2;

        // Draw the main line as two lines with a gap to contain the deletion X.
        if(isDeleting){
            // Draw a rect of the bg color over the intersection where the deletion X will be to cover old bracket drawings.
            // rectMode(CENTER);
            // noStroke();
            // fill(this.bgColor);
            // rect(leftEndpointX + bracketWidth, leftEndpointY, deletionXWidth * .25, deletionXWidth * .25);
            // stroke(inBracketColor);
            line(leftEndpointX, leftEndpointY, leftEndpointX + bracketCentralOffset, rightEndpointY);
            line(rightEndPointX, rightEndpointY, rightEndPointX - bracketCentralOffset, leftEndpointY);
        }
        // Otherwise just draw one line.
        else{
            line(leftEndpointX, leftEndpointY, rightEndPointX, rightEndpointY);// Main horizontal line
        }
        line(leftEndpointX, leftEndpointY, leftEndpointX, leftEndpointY - bracketHeight); // left vertical
        line(rightEndPointX, rightEndpointY, rightEndPointX, rightEndpointY - bracketHeight); // right vertical

        // Draw the red X over the bracket if it is being hovered over for deletion.
        if(isDeleting){
            push();
            translate(leftEndpointX + deletionXHorizontalCenter, leftEndpointY);
            // stroke(this.bgColor);
            // strokeWeight(12);
            // line(-deletionXWidth,  -deletionXWidth, deletionXWidth, deletionXWidth);
            // line(-deletionXWidth, deletionXWidth, deletionXWidth, -deletionXWidth);
            // stroke(inBracketColor);
            // strokeWeight(4);
            line(-deletionXWidth,  -deletionXWidth, deletionXWidth, deletionXWidth);
            line(-deletionXWidth, deletionXWidth, deletionXWidth, -deletionXWidth);
            pop();
        }

    }

    // This will draw a temporary bracket after the user has started their drag in the process of making a new group.
    drawGroupChoosingBracket(){
        if(this.textManagerRef.groupCreationStartIndex == -1)
            return;
        let startingIndex = this.textManagerRef.groupCreationStartIndex;
        let currentHoveringIndex = this.getIndexOfClickedChar();
        if(currentHoveringIndex == -1)
            return;
        // This swap allows groups to still be drawn even if dragging right to left.
        if(startingIndex > currentHoveringIndex){
            let tempVal = startingIndex;
            startingIndex = currentHoveringIndex;
            currentHoveringIndex = tempVal;
        }
        this.drawGroupBracket(startingIndex, abs((currentHoveringIndex - startingIndex) + 1), this.bracketColor, false);
    }

    setHoverStatus(){
        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            this.textCharButtonsArray[i].checkHoverStatus();
        }
        
        // Check if there is a character being hovered over. If so, check the char to the right (if not at the last index).
        for(let i = 0; i < this.textCharButtonsArray.length - 1; i++){
            if(this.textCharButtonsArray[i].isBeingHoveredOver && this.textCharButtonsArray[i+1].isBeingHoveredOver){
                //Set the one closest to the mouseX position as being hovered over and then set the other to not being hovered over.
                let leftHoverDistance = this.textCharButtonsArray[i].getXDistanceFromMouse();
                let rightHoverDistance = this.textCharButtonsArray[i+1].getXDistanceFromMouse();
                // Then if two are set to being hovered over, choose the closest one with an equal match going to the left textChar
                if(rightHoverDistance < leftHoverDistance){
                    this.textCharButtonsArray[i].setHoverStatusVariable(false);
                    this.textCharButtonsArray[i+1].setHoverStatusVariable(true);
                }
                else{
                    this.textCharButtonsArray[i].setHoverStatusVariable(true);
                    this.textCharButtonsArray[i+1].setHoverStatusVariable(false);
                }
                

            }
        }
    }

    drawLock(inX, inY, strokeColor, forButton){
        let lockWidth = this.textManagerRef.widthOfText * 0.75;
        if(this.usingMobile && forButton){
            lockWidth = this.textManagerRef.widthOfText * 1.5;
        }

        let textWidth = this.textManagerRef.widthOfText;
        let lockXBuffer = textWidth * 0.15;

        let lockYGap = 0.70 * this.textManagerRef.sizeOfText;
        // if(this.usingMobile){
        //     lockYGap = 0.10 * this.textManagerRef.sizeOfText;
        // }
        let lockYPos = inY - this.textManagerRef.sizeOfText - lockYGap;

        let barHeight = lockWidth / 6;
        let barXPosLeft = inX - (0.3 * lockWidth);
        let barXPosRight = inX + (0.3 * lockWidth);
        let barExtraFill = 0;
        let lockCrossOffset = lockWidth * .22;
        // Draw the main rounded square block of the lock.
        //strokeWeight(5);
        // TODO
        // Maybe set the stroke weight for the lock to be thinner on mobile where the lock is drawn smaller.
        rectMode(CENTER);
        stroke(strokeColor);
        strokeWeight(this.lockButton.diameter / 18);
        if(this.usingMobile && !forButton){
            strokeWeight(this.lockButton.diameter / 30);
        }
        noFill();
        rect(inX, inY, lockWidth, lockWidth, 4);

        strokeCap(PROJECT);
        // Draw the arc of the top of the lock
        arc(inX, inY - (lockWidth / 2) - barHeight, lockWidth * 0.6, lockWidth * 0.6, 180, 360);
        
        strokeCap(SQUARE);
        // Draw the two lines connecting the arc to the square of the lock.
        
        line(barXPosLeft, inY - (lockWidth / 2) - barHeight * .70 - barExtraFill, barXPosLeft, inY - (lockWidth / 2));
        line(barXPosRight, inY - (lockWidth / 2) - barHeight * .70 - barExtraFill, barXPosRight, inY - (lockWidth / 2));
        
        strokeCap(ROUND);
        // Draw X in the center of the lock.
        line(inX - lockCrossOffset, inY - lockCrossOffset, inX + lockCrossOffset, inY + lockCrossOffset);
        line(inX - lockCrossOffset, inY + lockCrossOffset, inX + lockCrossOffset, inY - lockCrossOffset);


    }

    drawLockedGroup(groupHeadIndex, groupUnitSize, inBracketColor, isDeleting){
        // The bracket will extend from the leftmost unit to the rightmost unit in the group.
        let groupEndIndex = groupHeadIndex + (groupUnitSize - 1);
        let groupLockWidth = this.textManagerRef.widthOfText * 0.75;
        stroke(inBracketColor);
        strokeWeight(4);
        if(this.usingMobile){
            strokeWeight(2.5);
        }
        

        let groupLineYRaise = this.textCharButtonsArray[groupHeadIndex].diameter * 1.4 + (groupLockWidth * 0.25);
        let charDiameter = this.textCharButtonsArray[groupHeadIndex].diameter / 2;
        let bracketHeight = charDiameter/4;

        let leftEndpointX = this.textCharButtonsArray[groupHeadIndex].posX - charDiameter;
        let leftEndpointY = this.textCharButtonsArray[groupHeadIndex].posY - groupLineYRaise;
        let rightEndPointX = this.textCharButtonsArray[groupEndIndex].posX + charDiameter;
        let rightEndpointY = this.textCharButtonsArray[groupEndIndex].posY - groupLineYRaise;
        let bracketWidth = rightEndPointX - leftEndpointX;

        let bracketCentralOffset = (bracketWidth * 0.5) - (groupLockWidth * .82);
        let deletionXWidth = charDiameter * 0.5;
        let deletionXHorizontalCenter = (rightEndPointX - leftEndpointX) / 2;

        let charGroupLockYOffset = this.buttonDiameter * .80;
        if(this.usingMobile){
            charGroupLockYOffset = this.buttonDiameter * .50;
        }

        // Always drawing the bracket as two lines since a lock is in the middle.
        line(leftEndpointX, leftEndpointY, leftEndpointX + bracketCentralOffset, rightEndpointY);
        line(rightEndPointX, rightEndpointY, rightEndPointX - bracketCentralOffset, leftEndpointY);

        line(leftEndpointX, leftEndpointY, leftEndpointX, leftEndpointY + bracketHeight); // left vertical bracket
        line(rightEndPointX, rightEndpointY, rightEndPointX, rightEndpointY + bracketHeight); // right vertical bracket

        // Draw the red X over the bracket if it is being hovered over for deletion.
        if(isDeleting){
            push();
            translate(leftEndpointX + deletionXHorizontalCenter, leftEndpointY);
            line(-deletionXWidth,  -deletionXWidth, deletionXWidth, deletionXWidth);
            line(-deletionXWidth, deletionXWidth, deletionXWidth, -deletionXWidth);
            pop();
        }
        // If not deleting, draw a lock at the center of the group.
        else{
            // Update input xPosition of lock based on shaking animation if needed.
            let lockXPosToDraw = this.updateLockShakeAnimation(groupHeadIndex, leftEndpointX + (bracketWidth / 2));
            this.drawLock(lockXPosToDraw, this.textCharButtonsArray[groupHeadIndex].posY - charGroupLockYOffset, inBracketColor, false);
        }

    }

    drawCharLocks(){
        // Button diameters are equal to 
        let charLockYOffset = this.buttonDiameter * .80;
        if(this.usingMobile){
            charLockYOffset = this.buttonDiameter * .50;
        }

        for(let i = 0; i < this.textManagerRef.charsArray.length; i++){
            
            if(this.textManagerRef.charsArray[i].isLocked){
                //TODO
                // If the head of a group is found, draw a lock bracket centered over the group.
                // Don't draw a lock for bodies of a group.
                if(this.textManagerRef.charsArray[i].groupOrder == 0){
                    this.drawLockedGroup(i, this.textManagerRef.charsArray[i].groupSize, this.lockColor, false);
                    continue;   // don't draw the lock again, move on to the next item.
                }
                // Draw locks for any locked non-grouped textChars.
                else if(this.textManagerRef.charsArray[i].groupOrder == -1){
                    // Update input xPosition of lock based on shaking animation if needed.
                    let lockXPosToDraw = this.updateLockShakeAnimation(i, this.textCharButtonsArray[i].posX);
                    this.drawLock(lockXPosToDraw, this.textCharButtonsArray[i].posY - charLockYOffset, this.lockColor, false);
                }
                
            }
        }
    }

    resetButtonsClicked(){
        this.scrambleButton.startedClickOnThis = false;
        this.editButton.startedClickOnThis = false;
        this.groupButton.startedClickOnThis = false;
        this.lockButton.startedClickOnThis = false;
        this.saveButton.startedClickOnThis = false;
    }

    setButtonStartedClickOn(){
        if(this.scrambleButton.isMouseOverButton()){
            this.scrambleButton.startedClickOnThis = true;
        }
        else if(this.editButton.isMouseOverButton()){
            this.editButton.startedClickOnThis = true;
        }
        else if(this.groupButton.isMouseOverButton()){
            this.groupButton.startedClickOnThis = true;
        }
        else if(this.saveButton.isMouseOverButton()){
            this.saveButton.startedClickOnThis = true;
        }
        else if(this.lockButton.isMouseOverButton()){
            this.lockButton.startedClickOnThis = true;
        }
        else if(this.deleteAllButton.isMouseOverButton()){
            this.deleteAllButton.startedClickOnThis = true;
        }
        // else{
        //     for(let i = 0; i < this.textCharButtonsArray.length; i++){

        //     }
        // }
    }

    deleteAllSavedScrambleButtons(){
        this.savedScrambleTextButtonsArray.splice(0);
        this.savedScrambleDeletionButtonsArray.splice(0);
    }

    updateLockShakeAnimation(charIndex, xToUpdate){
        // Don't change anything if the lock isn't shaking.
        if(this.textManagerRef.charsArray[charIndex].isShaking == false){
            return xToUpdate;
        }

        // print('updating lock shake amount');
        // print('starting shake position:' + xToUpdate);

        let updatedXPos = xToUpdate + this.textManagerRef.charsArray[charIndex].distanceFromLockCenter;
        // Increment the XPos by the shaking speed.
        let shakeAmount = this.textManagerRef.charsArray[charIndex].shakeSpeed * this.textManagerRef.charsArray[charIndex].shakeDirection;
        updatedXPos += shakeAmount;
        // print('shake amount:' + shakeAmount);
        // print('updated shake position:' + updatedXPos);

        this.textManagerRef.charsArray[charIndex].distanceFromLockCenter += shakeAmount;

        if(abs(this.textManagerRef.charsArray[charIndex].distanceFromLockCenter) > this.textManagerRef.charsArray[charIndex].shakeDistanceMax){
            this.textManagerRef.charsArray[charIndex].shakeDirection *= -1; // Reverse shake direction.
        }

        this.textManagerRef.charsArray[charIndex].animTimeRemaining -= deltaTime;

        // Stop the shaking if the animation time has completed.
        if(this.textManagerRef.charsArray[charIndex].animTimeRemaining <= 0){
            this.textManagerRef.stopLockShaking(charIndex);
            updatedXPos = xToUpdate;
        }

        return updatedXPos;

    }
}
