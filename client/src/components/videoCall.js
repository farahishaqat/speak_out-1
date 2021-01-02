import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  width: 100%;
`;
const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;
function VideoCall () {
    const [yourID, setYourID] = useState("");
    const [peers, setPeers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();
    useEffect (() => {
        socket.current = io.connect('/');
        console.log("connected")
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => { // method prompts the user for permission to use a media input which produces a MediaStream
            setStream(stream);
            if(userVideo.current){
                userVideo.current.srcObject = stream;
            }
        })
        socket.current.on("yourID", (id) => {
            setYourID(id);
        })
        socket.current.on("allUsers", (peers) => {
            setPeers(peers)
        })
        socket.current.on("hello", (data) => {
            console.log(data)
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal)
        })
}, []);
function callPeer(id){
    console.log("walaaaaa")
    const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
            iceServers: [
              {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
              },
              {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683" 
              }
          ]
      },
      stream: stream,
    });
    peer.on("signal", data => {
        socket.current.emit("callUser", { userTocall: id, signalData: data, from: yourID })
    })
    peer.on("stream", stream => {
        if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream;
        }
    });
    socket.current.on("callAccepted", signal => {
        setCallAccepted(true);
        peer.signal(signal);
    })
}
function acceptCall() {
    setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", data => {
            socket.current.emit("acceptCall", { signal: data, to: caller })
        })
        peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
        });
        peer.signal(callerSignal);
    }
    let UserVideo;
    if(stream) {
        UserVideo = (
            <Video playsInline muted ref={userVideo} autoPlay />
        );
    }
    let PartnerVideo;
    if (callAccepted) {
        PartnerVideo = (
            <Video playsInline ref={partnerVideo} autoPlay />
        );
    }
    let incomingCall;
  if (receivingCall) {
        incomingCall = (
            <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>  
        )
    }
    return (
        <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        {Object.keys(peers).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)}>Call {key}</button>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
      </Row>
    </Container>
    );
}
export default VideoCall;
//hiiii
