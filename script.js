function App() {
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [displayTime, setDisplayTime] = React.useState(sessionTime);
  const [isTimerOn, setIsTimerOn] = React.useState(false);
  const [isOnBreak, setIsOnBreak] = React.useState(false);

  const audioBeepRef = React.useRef(
    new Audio(
      "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    )
  );
  audioBeepRef.current.setAttribute("preload", "auto");

  // adding a useEffect hook to reset currentTime whenever audio is played again
  React.useEffect(() => {
    audioBeepRef.current.addEventListener("ended", () => {
      audioBeepRef.current.currentTime = 0;
    });
  }, []);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  // amount is in s => 5min = 300s
  const changeTime = (amount, type) => {
    if (type === "break") {
      setBreakTime((prev) => {
        let newTime = prev + amount;
        if (newTime > 60 * 60) {
          newTime = 60 * 60;
        } else if (newTime < 60) {
          newTime = 60;
        }
        return newTime;
      });
    } else {
      setSessionTime((prev) => {
        let newTime = prev + amount;
        if (newTime > 60 * 60) {
          newTime = 60 * 60;
        } else if (newTime < 60) {
          newTime = 60;
        }
        if (!isTimerOn) {
          setDisplayTime(newTime);
        }
        return newTime;
      });
    }
  };

  const controlTime = () => {
    let second = 1000; // 1000ms = 1s
    let date = new Date().getTime(); // in ms
    // nextDate is the next time my countdown should be triggered
    // which is in 1s
    let nextDate = new Date(Math.floor((date + 1000) / 1000) * 1000).getTime();
    let isOnBreakVar = isOnBreak;
    if (!isTimerOn) {
      // new interval timer that calls the callback every 1s
      let interval = setInterval(() => {
        // current time
        date = new Date().getTime();
        // checks if it's time to trigger the countdown
        if (date >= nextDate) {
          setDisplayTime((prev) => {
            if (prev - 1 <= 0) {
              audioBeepRef.current.play();
            }
            if (prev <= 0 && !isOnBreakVar) {
              isOnBreakVar = true;
              setIsOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && isOnBreakVar) {
              isOnBreakVar = false;
              setIsOnBreak(false);
              return sessionTime;
            }
            return prev - 1; // in s
          });

          // next point in time to trigger the countdown would be in 1s
          nextDate += second;
        }
      }, 1000);
      // passing interval id in local storage so I can clear the interval
      localStorage.clear(); // stops the countdown
      localStorage.setItem("interval-id", interval);
    }
    // in case you press pause
    if (isTimerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    // toggle countdown state => changes the button as well
    setIsTimerOn(!isTimerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    audioBeepRef.current.pause();
    audioBeepRef.current.currentTime = 0;
    console.log(isOnBreak);
    setIsOnBreak(false);
    console.log(isOnBreak);
    setIsTimerOn(false);
  };

  return (
    <div className="center-align">
      <h1>25 + 5 Clock</h1>
      <div className="handles-container">
        <Length
          title={"Break Length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime / 60}
          formatTime={formatTime}
        />
        <Length
          title={"Session Length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime / 60}
          formatTime={formatTime}
        />
      </div>
      <h4 id="timer-label">{!isOnBreak ? "Session" : "Break"}</h4>
      <h2 id="time-left">{formatTime(displayTime)}</h2>
      <button
        id="start_stop"
        className="btn deep-orange lighten-1"
        onClick={controlTime}
      >
        {isTimerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button
        id="reset"
        className="btn deep-orange lighten-1"
        onClick={resetTime}
      >
        <i className="material-icons">autorenew</i>
      </button>
      <audio
        id="beep"
        preload="auto"
        ref={audioBeepRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h4 id={type + "-label"}>{title}</h4>
      <div className="time-sets">
        <button
          id={type + "-decrement"}
          className="btn-small deep-orange lighten-1"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id={type + "-length"}>{time}</h3>
        <button
          id={type + "-increment"}
          className="btn-small deep-orange lighten-1"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
