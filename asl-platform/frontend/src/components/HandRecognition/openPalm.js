import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

export const openPalm = new GestureDescription('B, openness'); 

// Thumb 
openPalm.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
openPalm.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.25);
openPalm.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.25);

// Index
openPalm.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
openPalm.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);

// Pinky
openPalm.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
openPalm.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.25);

// Ring
openPalm.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
openPalm.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.25);

// Middle
openPalm.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
openPalm.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.25);




