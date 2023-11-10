/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useRef, useState } from "react";
import Canvas from "./components/Canvas";
import Button from "./components/Button";
import Spinner from "./components/Spinner/Spinner";

function App() {
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [loadedOpenCV, setLoadedOpenCV] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCVUrl = "https://docs.opencv.org/4.7.0/opencv.js";

  const loadOpenCv = useCallback(
    (onComplete: () => void) => {
      const isScriptPresent = !!document.getElementById("open-cv");
      if (isScriptPresent || loadedOpenCV) {
        setLoadedOpenCV(true);
        onComplete();
      } else {
        const script = document.createElement("script");
        script.id = "open-cv";
        script.src = openCVUrl;

        script.onload = function () {
          setTimeout(function () {
            onComplete();
          }, 1000);
          setLoadedOpenCV(true);
        };
        document.body.appendChild(script);
      }
    },
    [loadedOpenCV]
  );

  useEffect(() => {
    setIsLoading(true);
    loadOpenCv(() => {
      setIsLoading(false);
      console.log("OpenCV loaded...");
    });
  }, [loadOpenCv]);

  const openCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        // if (!canvasRef.current) return;
        // const context = canvasRef.current.getContext("2d");
        // context.clearRect(0, 0, canvas.width, canvas.height);
      }
      setIsCameraOn(false);
    } else {
      try {
        // @ts-ignore
        const scanner = new jscanify();
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext("2d");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        const video = document.createElement("video");
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          if (!canvasRef.current || !video) return;
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;

          video.play();

          setInterval(() => {
            // Draw the video frame on the canvas
            if (context && canvasRef.current) {
              context.drawImage(video, 0, 0);

              // Highlight the paper and draw it on the same canvas
              const resultCanvas = scanner.highlightPaper(canvasRef.current);
              context.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              ); // Clear the canvas
              context.drawImage(resultCanvas, 0, 0);
            }
            // Draw the highlighted paper
          }, 10);
        };
        setIsCameraOn(true);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen gap-4 p-4">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="text-4xl">Document Scanner</h1>

          <Canvas ref={canvasRef} width={640} height={480} />

          <Button onClick={openCamera}>
            {isCameraOn ? "Close camera" : "Open camera"}
          </Button>
        </>
      )}
    </main>
  );
}

export default App;
