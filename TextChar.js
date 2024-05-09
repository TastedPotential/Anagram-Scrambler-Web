class TextChar{

    constructor(inputChar){
        this.savedChar = inputChar;
        this.isLocked = false;
        this.relativePos = -1;
        this.groupOrder = -1;
        this.groupID = -1;
        this.groupSize = 0;
    
        this.isShaking = false;
        this.animTimeRemaining = -1;
        this.animDurationMillis = 333;
        this.animDurationNanos = this.animDurationMillis * 1000000;
    
        this.distanceFromLockCenter = 0;
        this.shakeDistanceMax = 0;
        this.shakeDirection = 1;
        this.shakeSpeed = 0;    
    }
    
}
