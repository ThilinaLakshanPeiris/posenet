//-------------------------------------------------------------------------------------------------------------------------------------
//--------------------working fine for  create my own dataseta as a .txt ---------------------------------------------------------------

import React, { useRef, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";
import { Container, Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [poseDataArray, setPoseDataArray] = useState([]);

  // Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    if(cameraOn) {
      const interval = setInterval(() => {
        detect(net);
      }, 1000);
      return () => clearInterval(interval); // cleanup
    }
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      // Accumulate pose data
      setPoseDataArray(prevPoseDataArray => [...prevPoseDataArray, pose]);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };


  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
  };

  const savePoseDataToFile = () => {
    const poseDataString = JSON.stringify(poseDataArray);
    const blob = new Blob([poseDataString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'pose_data.txt');
  };

  runPosenet();

  return (
    <div className="App">
      <Container>
        <Button onClick={toggleCamera}>
          {cameraOn ? 'Turn off camera' : 'Turn on camera'}
        </Button>
        <Button onClick={savePoseDataToFile} disabled={poseDataArray.length === 0}>
          Save Pose Data
        </Button>
      </Container>
      <Container>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
            display: cameraOn ? 'block' : 'none'
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
            zIndex: 9,
            width: 640,
            height: 480,
            display: cameraOn ? 'block' : 'none'
          }}
        />
      </Container>

    </div>
  );
}

export default App;


//-------------------downloading multiple txt files---------------------below code working fine but not stopping the array in the console----------------------------------------------------------------------
//-------------------------------------------------start the web camera with two buttons---------------------------------------------------------------------

// import React, { useRef, useState } from "react";
// import "./App.css";
// import * as tf from "@tensorflow/tfjs";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";
// import { drawKeypoints, drawSkeleton } from "./utilities";
// import { Container, Button } from 'react-bootstrap';
// import { saveAs } from 'file-saver';

// function App() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [cameraOn, setCameraOn] = useState(false);

//   //  Load posenet
//   const runPosenet = async () => {
//     const net = await posenet.load({
//       inputResolution: { width: 640, height: 480 },
//       scale: 0.8,
//     });
//     //
//     if(cameraOn) {
//       const interval = setInterval(() => {
//         detect(net);
//       }, 1000);
//       return () => clearInterval(interval); // cleanup
//     }
//   };



// const detect = async (net) => {
//   if (
//     typeof webcamRef.current !== "undefined" &&
//     webcamRef.current !== null &&
//     webcamRef.current.video.readyState === 4
//   ) {
//     // Get Video Properties
//     const video = webcamRef.current.video;
//     const videoWidth = webcamRef.current.video.videoWidth;
//     const videoHeight = webcamRef.current.video.videoHeight;

//     // Set video width
//     webcamRef.current.video.width = videoWidth;
//     webcamRef.current.video.height = videoHeight;

//     // Make Detections
//     const pose = await net.estimateSinglePose(video);
//     console.log(pose);

//     // Save pose data to a text file
//     const poseData = JSON.stringify(pose);
//     const blob = new Blob([poseData], { type: 'text/plain;charset=utf-8' });
//     saveAs(blob, 'pose_data.txt');

//     drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
//   }
// };


//   // const detect = async (net) => {
//   //   if (
//   //     typeof webcamRef.current !== "undefined" &&
//   //     webcamRef.current !== null &&
//   //     webcamRef.current.video.readyState === 4
//   //   ) {
//   //     // Get Video Properties
//   //     const video = webcamRef.current.video;
//   //     const videoWidth = webcamRef.current.video.videoWidth;
//   //     const videoHeight = webcamRef.current.video.videoHeight;

//   //     // Set video width
//   //     webcamRef.current.video.width = videoWidth;
//   //     webcamRef.current.video.height = videoHeight;

//   //     // Make Detections
//   //     const pose = await net.estimateSinglePose(video);
//   //     console.log(pose);

//   //     drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
//   //   }
//   // };


//   const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
//     const ctx = canvas.current.getContext("2d");
//     canvas.current.width = videoWidth;
//     canvas.current.height = videoHeight;

//     drawKeypoints(pose["keypoints"], 0.6, ctx);
//     drawSkeleton(pose["keypoints"], 0.7, ctx);
//   };

//   const toggleCamera = () => {
//     setCameraOn(!cameraOn);
//   };

//   runPosenet();

//   return (
//     <div className="App">
//       <Container>
//       <Button onClick={toggleCamera}>
//           {cameraOn ? 'Turn off camera' : 'Turn on camera'}
//         </Button>
//       </Container>
//       <Container>
//       <Webcam
//           ref={webcamRef}
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zIndex: 9,
//             width: 640,
//             height: 480,
//             display: cameraOn ? 'block' : 'none'
//           }}
//         />

//         <canvas
//           ref={canvasRef}
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zIndex: 9,
//             width: 640,
//             height: 480,
//             display: cameraOn ? 'block' : 'none'
//           }}
//         />
//       </Container>

//     </div>
//   );
// }

// export default App;

//-------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
