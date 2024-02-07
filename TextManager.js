class TextManager{

    constructor(inputFont, inputTextSizePercentage){
        this.charsArray = [];
        this.textAnchorX = windowWidth/2;;
        this.textAnchorY = windowHeight/4;
        this.textSizePercentage = inputTextSizePercentage;
        this.sizeOfText = windowWidth * this.textSizePercentage;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = this.widthOfText / 6; // divide by 6 for CourierPrime 20 for default monospace, 9 for SpaceMono, 0 value for Sometype (not needed)
        
        
        this.sketchFont = inputFont;

        let startingString = "type your scramble here";
        for(let i = 0; i < startingString.length; i++){
          this.charsArray.push(new TextChar(startingString.charAt(i)));
        }
        
        // What the heck, AT HIGHER RESOLUTIONS, making the width of the text box equal the number of characters and an equal number of gaps
        // makes the text align with the main display text. I had been using number of gaps as characters minus one accounts for gaps BETWEEN
        // charactes, but if it aligns when the gaps equal the characters, I won't complain.
        // Needs more tweaking to get it to work at lower resoluions, but it's aligning at 1920 and 3840 wide.
        this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
        //this.textBoxWidth = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);
        this.textInputBoxWidth = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);

        this.textInput = createInput("type your scramble here");
        this.textInput.position(this.textAnchorX - this.textBoxWidth/2 - this.textGap/2, this.textAnchorY - this.sizeOfText * 2);
        this.textInput.size(this.textInputBoxWidth + this.widthOfText/4);

        let sizeString = this.sizeOfText.toString() + "px";
        this.textInput.style('font-size', sizeString);
        this.textInput.style('font-family', 'CourierPrime-Regular');
        this.textInput.style('background-color', 'rgb(220,220,220)');
        this.textInput.style('border', '1');
        //this.textInsdput.style('font-kerning', 'none');
        //this.textInput.style('letter-spacing', '-1.4px');
        this.textInput.style('letter-spacing', '-1px');
        this.textInput.style('word-spacing', '-0.03em');
        this.textInput.style('white-space', '0em');

    }

    updateTextBoxWidth(){
      this.textBoxWidth = (this.charsArray.length * this.widthOfText) + ((this.charsArray.length - 1) * this.textGap);
    }

    updateProperties(){
      //background(220);
      // Update the main display scramble text.
      this.textAnchorX = windowWidth/2;
      this.textAnchorY = windowHeight/2;
      this.sizeOfText = windowWidth * this.textSizePercentage;
      this.widthOfText = this.sizeOfText/2;
      this.textGap = this.widthOfText / 6;
      this.updateTextBoxWidth();
      this.textInputBoxWidth = (this.charsArray.length * this.widthOfText) + (this.charsArray.length * this.textGap);

      // Update the text input box
      this.textInput.position(this.textAnchorX - this.textBoxWidth/2 - this.textGap/2, this.textAnchorY - this.sizeOfText * 2);
      this.textInput.size(this.textInputBoxWidth + this.widthOfText/4);
      let sizeString = this.sizeOfText.toString() + "px";
      this.textInput.style('font-size', sizeString);

    }
    
    drawText(yOffset){
      // This centers the main text horizontally on the screen.
      this.updateTextBoxWidth();      
      let windowCenterTextOffsetX = this.textBoxWidth / 2;    

      for(let i = 0; i < this.charsArray.length; i++){      
        noStroke();
        fill(0,0,0);  
        text(this.charsArray[i].savedChar, this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + (i * this.textGap), this.textAnchorY + yOffset);

        stroke(0,0,0);
        strokeWeight(1);
        line(this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + i * this.textGap,
        0, this.textAnchorX - windowCenterTextOffsetX + (i * this.widthOfText) + i * this.textGap, windowHeight);
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

    getCharsArrayAsString(){
      let outString = "";
      for(let charsElement of this.charsArray){
        outString += charsElement.savedChar;
      }
      return outString;
    }
}