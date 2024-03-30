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
        for(let i = 0; i < this.textCharButtonsArray.length; i++){
            if(this.textCharButtonsArray[i].clickedOn()){
                return i;
            }
        }
        return -1;  // if no textChar was clicked on
    }

    drawGroupLines(){
        let groupLineSize = -1;
        for(let i = 0; i < this.textManagerRef.charsArray.length; i++){
            // ONLY if we found the HEAD of a group, draw a grouping bracket
            if(this.textManagerRef.charsArray[i].groupOrder == 0){
                groupLineSize = this.textManagerRef.charsArray[i].groupSize;
                this.drawGroupBracket(i, groupLineSize);
            }
        }
    }

    drawGroupBracket(groupHeadIndex, groupUnitSize){
        // The bracket will extend from the leftmost unit to the rightmost unit in the group.
        let groupEndIndex = groupHeadIndex + (groupUnitSize - 1);
        stroke(163, 64, 201);
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
}
