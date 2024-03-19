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

        this.savedScrambleDeletionButtonsArray = [];
        this.savedScrambleTextButtonsArray = [];

    }

    drawButtons(){
        this.scrambleButton.drawButton();
        this.editButton.drawButton();
        this.saveButton.drawButton();        
        this.drawSavedScrambleTextButtons();
        this.drawSavedScrambleDeletionButtons();
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

        //TODO
        // Update savedScrambleTextButtonsArray and savedScrambleDeletionButtonsArray sizes.
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
}
