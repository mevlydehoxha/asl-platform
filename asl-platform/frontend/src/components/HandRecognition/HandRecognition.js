import React, { useRef, useState, useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./style.scss";
import { drawHand } from "./utilities";

//personalized gestures created by code
import {love} from "./love"; 
import {one} from "./one"; 
import {yellow} from "./yellow"; 
import {openPalm} from "./openPalm"; 
import {w} from "./w"; 

import * as fp from "fingerpose";
import victory from "./victory.png";
import thumbs_up from "./thumbs_up.png";

function HandRecognition() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [currentGesture, setCurrentGesture] = useState(null);
  const [emoji, setEmoji] = useState(null);
  const images = { thumbs_up: thumbs_up, victory: victory };

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded. Wait a few seconds.");
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);


      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          love,
          one,
          yellow,
          openPalm,
          
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          console.log(gesture.gestures);
  
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
  
          const detectedGesture = gesture.gestures[maxConfidence].name;
  
          if (detectedGesture === "thumbs_up") {
            setEmoji("OK");
            setCurrentGesture("approval, OK, encouragement, acceptance");
          } else if (detectedGesture === "victory") {
            setEmoji("V");
            setCurrentGesture("two, V, victory");
          } else {
            setEmoji(detectedGesture);
            setCurrentGesture(detectedGesture);
          }
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(()=>{runHandpose()},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 'fit-content',
            height: 600,
            borderRadius: "30px"
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        {currentGesture !== null && (
        <p style={{ color: "white", fontSize: "35px", marginTop: "20px", position:"absolute", top:"80px" }}>
          {currentGesture}
        </p>
        )}
      </header>
    </div>
  );
}

export default HandRecognition;
