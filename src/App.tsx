import React, {useState,useEffect, useDebugValue} from 'react';
import './App.css';

import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import closeBtn from "./assets/close.png";
import breakGif from "./assets/bird-break.gif";
import workGif from "./assets/duck-dance.gif";
import workBtn from "./assets/work.png";
import breakBtn from "./assets/break.png";
import workBtnClicked from "./assets/work-clicked.png";
import breakBtnClicked from "./assets/break-clicked.png";
import backgroundWork from "./assets/background-work.jpg";
import backgroundBreak from "./assets/background-break.png";
import backgroundWorking from "./assets/backgroundW.jpg";
import duckS from "./assets/duck-sound.mp3";
import miniBtn from "./assets/minimize.png";


function App() {

  const [timeLeft, setTimeLeft] = useState(25*60);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isBreak, setIsBreak]= useState(false);
  const [breakBtnImage, setBreakBtn]= useState(breakBtn);
  const [workBtnImage, setWorkBtn]= useState(workBtn);
  const [encouragment, setEncouragment]= useState('');
  const duckAudio= new Audio(duckS)

  const cheerMessages = [
    "Start working, it's time to write your term paper",
    "You Can Do It!",
    "I believe in you!",
    "You're amazing!",
    "Keep going!",
    "Stay focused!"
  ];
  const breakMessages = [
    "Stay hydrated!",
    "Snacks, maybe?",
    "Text me!",
    "I love you <3",
    "Stretch your legs!"
  ];

  //chage text
  useEffect(() =>{
    let messageIn: NodeJS.Timeout;
    if(isRunning){
      const message= isBreak ? breakMessages : cheerMessages;
      setEncouragment (message[0]);
      let index =1;

      messageIn = setInterval(()=>{
        setEncouragment(message[index]);
        index =(index+1)%message.length;
      },4000);
    }else{
      setEncouragment('');
    }
    return () => clearInterval(messageIn);
    },[isRunning, isBreak]);

  useEffect(() =>{
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft>0){
      timer = setInterval(() =>{
        setTimeLeft(prev => prev-1);
      }, 1000);
    }else if(timeLeft ===0){
      setIsRunning(false);
      // alert('Time is up! Take a break');
    }
    return() => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds/60).toString().padStart(2, '0');

    const s = (seconds%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  };

  //sound
  useEffect(() =>{
    if(timeLeft==0 && isRunning){
      const audio = new Audio(duckS);
      audio.play().catch(err => console.error("Ошибка звука:", err));
    }
  })

  //set work firs
  useEffect(() =>{
    swichMode(false);
  },[]);

  const swichMode = (breakMode: boolean) =>{
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakBtn(breakMode ? breakBtnClicked : breakBtn);
    setWorkBtn(breakMode ? workBtn : workBtnClicked);
    setTimeLeft(breakMode ? 5*60 : 25*60);
  }


  //custom change time
  const handleSetTime = (mins: number)=> {
    setIsRunning(false);
    setTimeLeft(mins*60);
    setCustomMinutes(mins);
  };
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  }

  //close
  const closeClick = () =>{
    if(window.electronAPI?.closeApp){
      window.electronAPI.closeApp();
    }else{
      console.warn('Electrone API not available');
    }
  }

  //minimized
  const miniClick =() =>{
    if(window.electronAPI?.minimizeApp){
      window.electronAPI.minimizeApp();
    }else{
      console.warn('Electron API not available');
    }
  }

const containerClass = `home-container ${isBreak ? "backgroundBreak" : "backgroundWorking"}`

 return(
  <div className="wrapper">
    <div className={containerClass} style = {{position: 'relative'}}>
      <div className='window-controls'>
        <button className='mini-btn' onClick={miniClick}>
          <img src={miniBtn} alt='Minimized'/>
        </button>
        <button className="close-button" onClick={closeClick}>
          <img src ={closeBtn} alt='Close'/>
        </button>
      </div>

      <div className="home-content">
        <div className='home-controls'>
          <button className='image-button' onClick={() => swichMode(false)}>
            <img src={workBtnImage} alt='Work'/>
          </button>
          <button className='image-button'onClick={() => swichMode(true)}>
            <img src={breakBtnImage}alt='Break'/>
          </button>
        </div>

        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          { encouragment }
        </p>

        <div className='gif-container'>
          <img src={isBreak ? breakGif : workGif} className='gif-image'/>
        </div>
        
        <h1 className='home-timer'>{formatTime(timeLeft)}</h1>

          <div className='time-action'>
            <button className='home-button' onClick={toggleTimer}>
              <img src={playImg} alt={isRunning ? 'Pause' : 'Start'}/>
            </button>
            <button className='home-button' onClick={() => setTimeLeft(isBreak ? 5 * 60 : 25 * 60)}>
              <img src={resetImg} alt='Reset' />
            </button>
          </div>
        <div className='popular-button'>
          <button className='change-time' onClick={() => handleSetTime(10)}>10:00</button>
          <button className='change-time'onClick={() => handleSetTime(15)}>15:00</button>
          <button className='change-time'onClick={() => handleSetTime(30)}>30:00</button>
        </div>

        {/*custom time by client */}
        <div className="custom-time-container">
          <input
          type="number"
          min= "1"
          className="custom-input"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(Number(e.target.value))}
          />
          <button className="custom-set-btn" onClick={()=> handleSetTime(customMinutes)}>Set custom</button>
        </div>
      </div>
    </div>
  </div>
 );
}

export default App;
