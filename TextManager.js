class TextManager{

    constructor(inputFont){
        this.charsArray = [];
        this.textAnchorX = windowWidth/2;;
        this.textAnchorY = windowHeight/2;
        this.sizeOfText = windowWidth/15;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = 0; // divide by 20 for default monospace, 9 for SpaceMono, 0 value for Sometype (not needed)
        this.sketchFont = inputFont;

        let startingString = "Type your scramble here:";
        for(let i = 0; i < startingString.length; i++){
          this.charsArray.push(new TextChar(startingString.charAt(i)));
        }
    }

    updateProperties(){
        this.textAnchorX = windowWidth/2;;
        this.textAnchorY = windowHeight/2;
        this.sizeOfText = windowWidth/15;
        this.widthOfText = this.sizeOfText/2;
    }

    drawText(yOffset, kerning){
        if(kerning == 0)
          this.textGap = kerning;  
        else
          this.textGap = this.widthOfText / kerning;
      
        // This centers the main text horizontally on the screen.
        let windowCenterTextOffsetX = ((this.charsArray.length * this.widthOfText) / 2) + (((this.charsArray.length - 1) * this.textGap) / 2);
      
        for(let i = 0; i < this.charsArray.length; i++){
          text(this.charsArray[i].savedChar, this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + i * this.textGap, this.textAnchorY + yOffset);
        }
    }
}