class ButtonsManager{
    constructor(inputTextManager, inButtonSizePercentage, isMobileDevice){
        this.buttonDiameterFactor = inButtonSizePercentage;
        this.buttonDiameter = windowWidth * this.buttonDiameterFactor;

        this.buttonOffsetX = inputTextManager.sizeOfText;
        this.buttonOffsetY = inputTextManager.sizeOfText / 4;
        if(isMobileDevice == true){
            this.buttonOffsetX = -inputTextManager.sizeOfText;
            this.buttonOffsetY = -inputTextManager.sizeOfText;
        }

        this.scrambleButton = new Button(inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - this.buttonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "scramble");
        this.editButton = new Button(inputTextManager.textAnchorX + inputTextManager.textBoxWidth / 2 + this.buttonOffsetX,
        inputTextManager.textAnchorY - this.buttonOffsetY, this.buttonDiameter, "edit");   
    }

    drawButtons(){
        this.scrambleButton.drawButton();
        this.editButton.drawButton();
    }

    updateProperties(inputTextManager){
        this.buttonDiameter = windowWidth * this.buttonDiameterFactor;        
        this.scrambleButton.posX = inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - inputTextManager.sizeOfText;
        this.scrambleButton.posY = inputTextManager.textAnchorY - inputTextManager.sizeOfText / 4;
        this.scrambleButton.diameter = this.buttonDiameter;

        this.editButton.posX = inputTextManager.textAnchorX + inputTextManager.textBoxWidth / 2 + inputTextManager.sizeOfText;
        this.editButton.posY = inputTextManager.textAnchorY - inputTextManager.sizeOfText / 4;
        this.editButton.diameter = this.buttonDiameter;
    }
}
