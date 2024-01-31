class ButtonsManager{
    constructor(inputTextManager, inButtonDivisor){
        this.buttonDiameterFactor = inButtonDivisor;
        this.buttonDiameter = windowWidth / this.buttonDiameterFactor;
        this.scrambleButton = new Button(inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - inputTextManager.sizeOfText,
        inputTextManager.textAnchorY - inputTextManager.sizeOfText / 4, this.buttonDiameter);
    }

    drawButtons(){
        noStroke();
        fill(255, 0, 0);
        circle(this.scrambleButton.posX, this.scrambleButton.posY, this.scrambleButton.diameter);
    }

    updateProperties(inputTextManager){
        this.buttonDiameter = windowWidth / this.buttonDiameterFactor;        
        this.scrambleButton.posX = inputTextManager.textAnchorX - inputTextManager.textBoxWidth / 2 - inputTextManager.sizeOfText;
        this.scrambleButton.posY = inputTextManager.textAnchorY - inputTextManager.sizeOfText / 4;
        this.scrambleButton.diameter = this.buttonDiameter;
    }
}
