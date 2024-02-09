import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

export const w = new GestureDescription('W, 3'); 

// Index 
w.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
w.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);


// Middle
w.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
w.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.25);


// Ring
w.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
w.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.25);

for(let finger of [Finger.Thumb, Finger.Pinky]){
    w.addCurl(finger, FingerCurl.FullCurl, .75); 
    w.addDirection(finger, FingerDirection.VerticalDown, 0.25);
}




