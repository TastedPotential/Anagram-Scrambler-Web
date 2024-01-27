class TextChar{

    constructor(inputChar){
        this.savedChar = inputChar;
        this.isLocked = false;
        this.relativePos = -1;
        this.familyOrder = -1;
        this.familyID = -1;
        this.familySize = 0;
    
        this.isShaking = false;
        this.animStartTime = 0;
        this.animDurationMillis = 333;
        this.animDurationNanos = this.animDurationMillis * 1000000;
    
        this.distanceFromLockCenter = 0;
        this.shakeDistanceMax = 0;
        this.shakeDirection = 1;
        this.shakeSpeed = windowWidth / 30;
    
    }

}
