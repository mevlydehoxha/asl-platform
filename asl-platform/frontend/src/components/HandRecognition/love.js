import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

export const love = new GestureDescription('love'); 

// Thumb 
love.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
love.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.25);
love.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.25);

// Index
love.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
love.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);

// Pinky
love.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
love.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.25);

for(let finger of [Finger.Middle, Finger.Ring]){
    love.addCurl(finger, FingerCurl.FullCurl, .75); 
    love.addDirection(finger, FingerDirection.VerticalDown, 0.25);
}




