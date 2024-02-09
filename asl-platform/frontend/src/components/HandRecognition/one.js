import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const one = new GestureDescription('one');

// Index
one.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
one.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);



for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  one.addCurl(finger, FingerCurl.FullCurl, 0.75);
  one.addDirection(finger, FingerDirection.VerticalDown, 0.25);
}
