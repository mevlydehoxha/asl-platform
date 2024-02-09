import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

export const yellow = new GestureDescription('yellow, Y, play, why'); 

// Thumb 
yellow.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
yellow.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.25);
yellow.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.25);


// Pinky
yellow.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
yellow.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.25);

for(let finger of [Finger.Middle, Finger.Ring, Finger.Index]){
    yellow.addCurl(finger, FingerCurl.FullCurl, .75); 
    yellow.addDirection(finger, FingerDirection.VerticalDown, 0.25);
}




