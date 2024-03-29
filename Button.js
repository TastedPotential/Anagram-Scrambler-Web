class Button{
    constructor(inX, inY, inDiameter, buttonType){
        this.posX = inX;
        this.posY = inY;
        this.diameter = inDiameter;
        // to be a string of either: "shuffle, edit, save, copy"
        this.buttonType = buttonType;
        this.startedClickOnThis = false;
        this.buttonFillColor = 'rgb(253, 253, 249)';
        this.buttonShadowColor = 'rgb(27, 34, 66)';
        this.buttonIconColor = 'rgb(55, 67, 117)';
        this.savedScrambleText = '';
        this.textHeight = '';
    }

    clickedOn(){

        // Check for square buttons
        if(this.buttonType === "savedScrambleText"){
            if(mouseX <= this.posX + this.diameter / 2 && mouseX >= this.posX - this.diameter / 2
            && mouseY <= this.posY + this.textHeight / 2 && mouseY >= this.posY - this.textHeight / 2){                
                return true;
            }
            else{
                return false;
            }
        }
        // Square check for deletion buttons.
        else if(this.buttonType === "savedScrambleDeletion"){
            if(mouseX <= this.posX + this.diameter / 2 && mouseX >= this.posX - this.diameter / 2
            && mouseY <= this.posY + (this.diameter / 4) + (this.diameter / 2)
            && mouseY >= this.posY + (this.diameter / 4) - (this.diameter / 2)){
                return true;
            }
            else{
                return false;
            }
        }

        // Check for circular buttons
        else if(dist(mouseX, mouseY, this.posX, this.posY) <= this.diameter / 2){
            return true;
        }
        else{
            return false;
        }
            
    }

    drawButton(){
        noStroke();

        if(this.buttonType === "scramble"){
            //fill(227, 45, 45);
            fill(this.buttonFillColor);
            circle(this.posX, this.posY, this.diameter);
            stroke(this.buttonIconColor);            
            strokeWeight(this.diameter/12);
            let lineLength = this.diameter * 0.6;
            let triDiv = 12;
            // Will adjust the parts that are covered by the triangles by 5 degrees to have clean lines.
            let arcGap = 20;    
            angleMode(DEGREES);            
            // Bottom arc arrow
            push();
            translate(this.posX, this.posY);
            noFill();
            arc(0,0, lineLength, lineLength, arcGap + 5, 180-arcGap);            
            translate(lineLength /2, tan(arcGap) * lineLength /2);
            rotate(-45);
            fill(this.buttonIconColor);
            triangle(-lineLength/triDiv, -lineLength/triDiv, 0, 0, -lineLength/triDiv, lineLength/triDiv);
            pop();
            // Top Arc Arrow
            push();
            translate(this.posX, this.posY);
            noFill();
            arc(0,0, lineLength, lineLength, 180 + arcGap + 5, -arcGap);            
            translate(-lineLength /2, -(tan(arcGap) * lineLength /2));
            rotate(135);
            fill(this.buttonIconColor);
            triangle(-lineLength/triDiv, -lineLength/triDiv, 0, 0, -lineLength/triDiv, lineLength/triDiv);
            pop();
        }
        else if(this.buttonType === "edit"){
            /*
            fill(47, 47, 214);
            circle(this.posX, this.posY, this.diameter);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(this.diameter * 0.85);
            text("E", this.posX, this.posY - this.diameter/10);
            */
            //fill(47, 47, 214);
            fill(this.buttonFillColor);
            circle(this.posX, this.posY, this.diameter);
            fill(255);
            angleMode(DEGREES);
            push();
            translate(this.posX, this.posY);
            rectMode(CENTER);
            rotate(315);
            fill(this.buttonIconColor);
            rect(0,0, this.diameter * .52, this.diameter * .15);
            triangle(-this.diameter * .44, 0, -this.diameter * .30, this.diameter * .075, -this.diameter * .30, -this.diameter * .075);
            rect(this.diameter * .358, 0, this.diameter * .12, this.diameter * .15, 0, this.diameter * .05, this.diameter * .05, 0);

            stroke(this.buttonFillColor);
            strokeWeight(this.diameter/35);
            // graphite line
            line(-this.diameter * .37, this.diameter * .075, -this.diameter * .37, -this.diameter * .075);

            // mid line
            //line(-this.diameter * .25, 0, this.diameter * .25, 0);

            strokeWeight(this.diameter/40);
            // double mid lines
            //line(-this.diameter * .25, this.diameter * .0325, this.diameter * .25, this.diameter * .0325);
            //line(-this.diameter * .25, -this.diameter * .0325, this.diameter * .25, -this.diameter * .0325);
            pop();

            
        }
        else if(this.buttonType === "save"){
            //fill(116, 50, 191);
            fill(this.buttonFillColor);
            circle(this.posX, this.posY, this.diameter);
            fill(this.buttonIconColor);
            push();
            translate(this.posX, this.posY);
            angleMode(DEGREES);
            rotate(270);
            rectMode(CENTER);
            rect(this.diameter * .10, 0, this.diameter * .60, this.diameter * .15);
            triangle(-this.diameter * .28, 0, -this.diameter * .08, this.diameter * .20, -this.diameter * .08   , -this.diameter * .20);
            stroke(this.buttonIconColor);
            strokeWeight(this.diameter/16);
            line(-this.diameter * .35, this.diameter * .20, -this.diameter * .35, -this.diameter * .20,);
            pop();

        }

        else if(this.buttonType === "savedScrambleDeletion"){
            //stroke(196, 22, 45, 128);
            stroke(184, 59, 50);
            angleMode(DEGREES);
            push();
            translate(this.posX, this.posY + this.diameter/4);
            //rotate(45);
            line(-this.diameter/2, this.diameter/2, this.diameter/2, -this.diameter/2);
            //rotate(90);
            line(-this.diameter/2, -this.diameter/2, this.diameter/2, this.diameter/2);
            pop();
        }

        else if(this.buttonType === "savedScrambleText"){
            //noStroke();
            //fill(18, 21, 99);
            fill(this.buttonFillColor);
            textAlign(CENTER, CENTER);
            text(this.savedScrambleText, this.posX, this.posY);
            
            // This is a "hitbox" rectangle for debugging purposes.
            // stroke(18, 21, 99);
            // strokeWeight(1);
            // noFill();
            // rectMode(CENTER);
            // rect(this.posX, this.posY, this.diameter, this.textHeight);
            
        }

        else if(this.buttonType === "group"){
            //noStroke();
            angleMode(DEGREES);            
            fill(this.buttonFillColor);
            circle(this.posX, this.posY, this.diameter);
            stroke(this.buttonIconColor);

            let arrowHead = this.diameter * .22;
            let arrowShaft = this.diameter * .40;
            let arrowTipGap = this.diameter / 14;
            push();
            translate(this.posX, this.posY);
            line(-arrowShaft, 0, -arrowTipGap, 0);
            line(arrowShaft, 0, arrowTipGap, 0);
            // Left arrowHead           
            translate(-arrowTipGap, 0);
            rotate(45);     
            line(-arrowHead, 0, 0, 0);
            rotate(-90);
            line(-arrowHead, 0, 0, 0);
            // Right arrowHead
            rotate(45); // reset rotation back to zero
            translate(2 * arrowTipGap, 0);
            rotate(45);
            line(arrowHead, 0, 0, 0);
            rotate(-90);
            line(arrowHead, 0, 0, 0);
            pop();

            // // Trigonometry method
            // //stroke(0,255,0);
            // let arrowHeadAngle = 35;
            // //arrowHead = this.diameter * .28;
            // push();
            // translate(this.posX, this.posY);
            // line(-arrowShaft, 0, -arrowTipGap, 0);
            // line(arrowShaft, 0, arrowTipGap, 0);
            // // left arrowhead
            // line(-cos(arrowHeadAngle)*arrowHead, sin(arrowHeadAngle) * arrowHead, -arrowTipGap, 0);
            // line(-cos(arrowHeadAngle)*arrowHead, -sin(arrowHeadAngle) * arrowHead, -arrowTipGap, 0);
            // line(cos(arrowHeadAngle)*arrowHead, sin(arrowHeadAngle) * arrowHead, arrowTipGap, 0);
            // line(cos(arrowHeadAngle)*arrowHead, -sin(arrowHeadAngle) * arrowHead, arrowTipGap, 0);
            // pop();
        }
    }
    
    // May not use. Was testing it out but I'm not a fan of how this "drop shadow" looks so far.
    drawButtonShadow(){
        fill(this.buttonShadowColor);
        circle(this.posX, this.posY + this.diameter/15, this.diameter * 1.05);
    }
}