class ButtonsManager{
    constructor(inputTextManager, inButtonSizePercentage, isMobileDevice){
        this.buttonDiameterFactor = inButtonSizePercentage;
        this.buttonDiameter = windowWidth * this.buttonDiameterFactor;

        this.buttonOffsetX = inputTextManager.sizeOfText;
        this.buttonOffsetY = inputTextManager.sizeOfText / 4;
        this.usingMobile = isMobileDevice;

        let saveButtonOffsetX = inputTextManager.sizeOfText * 1.25;
        if(this.usingMobile == true){
            this.buttonOffsetX = -inputTextManager.sizeOfText;
            this.buttonOffsetY = -inputTextManager.sizeOfText * 3;
            saveButtonOffsetX = -inputTextManager.textBoxWidth / 2 - this.buttonOffsetX;   // this will place it in the middle on mobile.
        }

        this.scrambleButton = new Button(inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - this.buttonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "scramble");

        this.editButton = new Button(inputTextManager.textAnchorX + inputTextManager.textBoxWidth / 2 + this.buttonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "edit");

        this.saveButton = new Button(inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - this.buttonOffsetX - saveButtonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "save");

        this.groupButton = new Button(this.editButton.posX + this.buttonDiameter, this.editButton.posY - this.buttonDiameter, this.buttonDiameter, "group");

        this.savedScrambleDeletionButtonsArray = [];
        this.savedScrambleTextButtonsArray = [];
        this.textCharButtonsArray = [];

        this.textManagerRef = inputTextManager;
        this.bracketColor = 'rgb(163, 64, 201)';

    }

    drawButtons(){
        this.scrambleButton.drawButton();
        this.editButton.drawButton();
        this.saveButton.drawButton();
        this.groupButton.drawButton();
        this.drawSavedScrambleTextButtons();
        this.drawSavedScrambleDeletionButtons();
        if(this.textManagerRef.editingText == false){
            this.drawTextCharButtons();
            this.drawGroupLines();// draw group lines
            // draw locks/brackets
        }

    }

    updateProperties(inputTextManager){
        this.buttonDiameter = windowWidth * this.buttonDiameterFactor;

        this.buttonOffsetX = inputTextManager.sizeOfText;
        this.buttonOffsetY = inputTextManager.sizeOfText / 4;

        let saveButtonOffsetX = inputTextManager.sizeOfText * 1.25;
        if(this.usingMobile == true){
            this.buttonOffsetX = -inputTextManager.sizeOfText;
            this.buttonOffsetY = -inputTextManager.sizeOfText;
            saveButtonOffsetX = -inputTextManager.textBoxWidth / 2 - this.buttonOffsetX;   // this will place it in the middle of the screen on mobile.
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

        this.groupButton.posX = this.editButton.posX + this.buttonDiameter;
        this.groupButton.posY = this.editButton.posY - this.buttonDiameter;
        this.groupButton.diameter = this.buttonDiameter;


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
    }
    
    drawTextCharButtons(){
        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            this.textCharButtonsArray[i].drawButton();
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
    drawGroupLines(){
        let groupLineUnits = -1;
        for(let i = 0; i < this.textManagerRef.charsArray.length; i++){
            // ONLY if we found the HEAD of a group, draw a grouping bracket
            if(this.textManagerRef.charsArray[i].groupOrder == 0){
                groupLineUnits = this.textManagerRef.charsArray[i].groupSize;
                this.drawGroupBracket(i, groupLineUnits, this.bracketColor);
            }
        }
    }

    drawGroupBracket(groupHeadIndex, groupUnitSize, inBracketColor){
        // The bracket will extend from the leftmost unit to the rightmost unit in the group.
        let groupEndIndex = groupHeadIndex + (groupUnitSize - 1);
        stroke(inBracketColor);
        strokeWeight(4);

        let groupLineYDrop = this.textCharButtonsArray[groupHeadIndex].diameter * 1.5;
        let charDiameter = this.textCharButtonsArray[groupHeadIndex].diameter / 2;
        let bracketHeight = charDiameter/4;

        let leftEndpointX = this.textCharButtonsArray[groupHeadIndex].posX - charDiameter;
        let leftEndpointY = this.textCharButtonsArray[groupHeadIndex].posY + groupLineYDrop;
        let rightEndPointX = this.textCharButtonsArray[groupEndIndex].posX + charDiameter;
        let rightEndpointY = this.textCharButtonsArray[groupEndIndex].posY + groupLineYDrop;

        line(leftEndpointX, leftEndpointY, rightEndPointX, rightEndpointY);// Main horizontal line
        line(leftEndpointX, leftEndpointY, leftEndpointX, leftEndpointY - bracketHeight); // left vertical
        line(rightEndPointX, rightEndpointY, rightEndPointX, rightEndpointY - bracketHeight); // right vertical

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
        this.drawGroupBracket(startingIndex, abs((currentHoveringIndex - startingIndex) + 1), this.bracketColor);
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
}
