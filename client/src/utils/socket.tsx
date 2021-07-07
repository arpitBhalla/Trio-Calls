import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "peerjs";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { useAppDispatch, useAppSelector } from "core/hooks/redux";
import { ServerURL } from "core/const";
import {
  removeParticipant,
  updateChat,
  updateMeetDetails,
  updateParticipant,
} from "core/actions/meeting";
import {
  toggleAudio,
  toggleHand,
  toggleScreen,
  toggleVideo,
} from "core/actions/media";

const peers: never[] = [];

export const useVideoConferencing = (): void => {
  const peerJs = React.useRef<Peer>();
  const socketClient =
    React.useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const {
    mediaReducer: { videoStream: myStream },
  } = useAppSelector(({ mediaReducer, meetReducer }) => ({
    mediaReducer,
    meetReducer,
  }));
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");

  useEffect(() => {
    peerJs.current = new Peer(undefined, {
      path: "/peerjs",
      host: ServerURL,
      port: 8000,
    });
    socketClient.current = io(ServerURL);
    peerJs.current.on("open", (id) => {
      socketClient.current?.emit("join-room", roomId, id);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        //audio: true,
      })
      .then((stream) => {
        const myVideo = document.createElement("video");
        handleAddVideoStream(myVideo, stream);
        handleAnswerCall(stream);
      })
      .catch((error) => {
        console.error(error);
      });

    socketClient.current?.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].destroy();
      socketClient.current?.disconnect();
    });

    const handleAnswerCall = (stream) => {
      peerJs.current?.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          handleAddVideoStream(video, userVideoStream);
        });
      });
    };

    const handleNewUserJoin = () => {
      socketClient.current?.on("user-connected", (userId) => {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            //audio: true, // For Testing Purpose
          })
          .then((stream) => {
            const call = peerJs.current?.call(userId, stream);
            const video = document.createElement("video");

            call?.on("stream", (userVideoStream) => {
              handleAddVideoStream(video, userVideoStream);
            });

            call?.on("close", () => {
              video.remove();
            });

            peers[userId] = call;
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };

    handleNewUserJoin();

    return () => {
      socketClient.current?.off();
    };
  }, [roomId]);

  const handleAddVideoStream = (video, stream) => {
    const videoGrid = document.getElementById("video-grid");
    video.srcObject = stream;

    video.addEventListener("loadedmetadata", () => {
      video.play();
      video.muted = true; // muted for testing purposes
    });
    videoGrid.append(video);
  };

  // Handlining Mute And Unmute
  const handleMuteUnmute = () => {
    const enabled = myStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false;
      setMuted(true);
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      setMuted(false);
    }
  };

  //Handling video off and one
  const handlePlayStopVideo = () => {
    const enabled = myStream.getVideoTracks()[0].enabled;

    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false;
      setHideVideo(true);
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      setHideVideo(false);
    }
  };

  // MESSAGE PART
  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    socketClient.current?.emit("message", {
      message: message,
      userId: peerJs.current?.id,
    });
    setMessage("");
    event.target.reset();
  };

  const handleLeaveMeet = () => {
    window.location.href = "/";
  };
};
