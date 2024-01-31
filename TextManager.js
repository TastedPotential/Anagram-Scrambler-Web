class TextManager{

    constructor(inputFont, inputTextSizeFactor){
        this.charsArray = [];
        this.textAnchorX = windowWidth/2;;
        this.textAnchorY = windowHeight/2;
        this.textSizeFactor = inputTextSizeFactor;
        this.sizeOfText = windowWidth/this.textSizeFactor;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = this.widthOfText / 6; // divide by 6 for CourierPrime 20 for default monospace, 9 for SpaceMono, 0 value for Sometype (not needed)
        
        this.sketchFont = inputFont;

        let startingString = "startingScramble";
        for(let i = 0; i < startingString.length; i++){
          this.charsArray.push(new TextChar(startingString.charAt(i)));
        }
        this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
    }

    updateTextBoxWidth(){
      this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
    }

    updateProperties(){
        this.textAnchorX = windowWidth/2;
        this.textAnchorY = windowHeight/2;
        this.sizeOfText = windowWidth/this.textSizeFactor;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = this.widthOfText / 6;
        this.updateTextBoxWidth();
    }
    
    drawText(yOffset){
      fill(0,0,0);
      // This centers the main text horizontally on the screen.
      this.updateTextBoxWidth();      
      let windowCenterTextOffsetX = this.textBoxWidth / 2;    
      for(let i = 0; i < this.charsArray.length; i++){
        text(this.charsArray[i].savedChar, this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + i * this.textGap, this.textAnchorY + yOffset);
      }
    }

    scrambleCharsArray(){
        let lowestIndex = 0;
        let randomIndex = 0;
        for(let i = lowestIndex; i < this.charsArray.length; i++){
            randomIndex = floor(random(lowestIndex, this.charsArray.length));
            this.charsArray.splice(0, 0, this.charsArray[randomIndex]);
            this.charsArray.splice(randomIndex+1, 1);
        }
    }
}