class TextManager{

    constructor(inputFont, inputTextSizePercentage){
        this.charsArray = [];
        this.textSizePercentage = inputTextSizePercentage;
        this.sizeOfText = windowWidth * this.textSizePercentage;
        this.widthOfText = this.sizeOfText/2;
        this.textGap = this.widthOfText / 6; // divide by 6 for CourierPrime 20 for default monospace, 9 for SpaceMono, 0 value for Sometype (not needed)
        this.editingText = false;
        
        this.textAnchorX = windowWidth/2;;
        this.textAnchorY = this.sizeOfText * 2; // Place the main display text 2 text-heights down from the top of the screen.        
        
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

        // Info on Input Elements here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
        this.textInput = createInput("type your scramble here");
        this.textInputOffsetY = this.sizeOfText * .82;
        this.textInput.position(this.textAnchorX - this.textBoxWidth/2 - this.textGap/2, this.textAnchorY - this.textInputOffsetY);
        this.textInput.size(this.textInputBoxWidth + this.widthOfText/4);

        let sizeString = this.sizeOfText.toString() + "px";
        this.textInput.style('font-size', sizeString);
        this.textInput.style('font-family', 'CourierPrime-Regular');
        this.textInput.style('background-color', 'rgb(255, 251, 161)');
        this.textInput.style('border', '1');
        //this.textInsdput.style('font-kerning', 'none');
        //this.textInput.style('letter-spacing', '-1.4px');
        this.textInput.style('letter-spacing', '-1px');
        this.textInput.style('word-spacing', '-0.03em');
        this.textInput.style('white-space', '0em');
        this.textInput.id('textInputID');
        this.textInput.hide();

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
      this.textInput.position(this.textAnchorX - this.textBoxWidth/2 - this.textGap/2, this.textAnchorY - this.textInputOffsetY);
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
        textAlign(LEFT, BASELINE);
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
      for(let i = 0; i < inString.length; i++){
        this.charsArray.push(new TextChar(inString.charAt(i)));
      }
    }

    setTextInputValue(){
      // Learned that fullstring needed to be initialized as an empty string otherwise the first character was "undefined".
      let fullstring = "";  
      for(let i = 0; i < this.charsArray.length; i++){
        fullstring += this.charsArray[i].savedChar;
      }
      this.textInput.value(fullstring);
    }
}