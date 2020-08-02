class AppState {
    constructor() {
        // Time
        this.timer = null;
        this.ticking = false;
        this.timerAction = timerAction.WORK;
        this.tickingTime = 0;

        // Sound
        this.numOfAlarm = 1;
        this.alarmSound = new Audio('./public/sound/beep.mp3');
       
        // DOM 
        this.timerDOM = document.getElementById('timer');
        this.workTimeDOM = document.getElementById('workTime');
        this.shortBreakDOM = document.getElementById('shortBreak');
        this.longBreakDOM = document.getElementById('longBreak');
        this.playPauseButtonDOM = document.getElementById('playPauseButton');
    }
}

// Timer Action ENUM
const timerAction = {
    WORK: 'WORK',
    SHORT_BREAK: 'SHORT_BREAK',
    LONG_BREAK: 'LONG_BREAK'
};

// State
let state = new AppState();

// Timer 
function startTimer() {
    state.ticking = true;
    clearInterval(state.timer);
    state.timer = setInterval(tick, 1000);
    state.playPauseButtonDOM.textContent = 'Pause';
    addClass(document.getElementById('playPauseButton'), 'btn-danger', 'btn-success');
}

function tick() {
    state.tickingTime--;
    let stringTime = secondsToTime(state.tickingTime);
    state.timerDOM.textContent = stringTime;
    setDocumentTitle(stringTime);
    if(state.tickingTime === 0) {
        clearInterval(state.timer);
        playAlarm();
    }
}

function pauseTimer() {
    clearInterval(state.timer);
    state.ticking = false;
    state.playPauseButtonDOM.textContent = 'Play';
    addClass(document.getElementById('playPauseButton'), 'btn-success', 'btn-danger');
}

function playAlarm() {
  for(let i = 0; i < state.numOfAlarm; i++) {
      setTimeout(() => { state.alarmSound.play() }, 1000 * (i + 1));
  }
}

// utils

function setDocumentTitle(stringTime) {
    switch(state.timerAction) {
        case timerAction.WORK:
            window.document.title = stringTime + '😤';
            break;
        case timerAction.LONG_BREAK:   
            window.document.title = stringTime + '😴';
            break;
        case timerAction.SHORT_BREAK:
            window.document.title = stringTime + '🤠';
    }
}

function addClass(ele, classToAdd, classToRemove = null) {
    if(classToRemove) {
        if(ele.classList.contains(classToRemove)) {
            ele.classList.remove(classToRemove);
        }
    }
    if(!ele.classList.contains(classToAdd)) {
        ele.classList.add(classToAdd);
    }   
}

function removeClass(ele, classToRemove, classToAdd = null) {
    if(classToAdd && !ele.classList.contains(classToAdd)) {
        ele.classList.add(classToAdd);
    }
    
    if(ele.classList.contains(classToRemove)) {
        ele.classList.remove(classToRemove);
    }
}

function secondsToTime(sec) {
    let minutes = parseInt(sec / 60);
    let seconds = parseInt(sec % 60);

    if(minutes < 10) {
        minutes = '0' + minutes;
    }

    if(seconds < 10) {
        seconds = '0' + seconds;
    }

    return `${minutes}:${seconds}`;
}

function timerActionToTimeString() {
    switch (state.timerAction) {
        case timerAction.WORK:
             return secondsToTime(parseInt(state.workTimeDOM.value) * 60);
        case timerAction.SHORT_BREAK:
             return secondsToTime(parseInt(state.shortBreakDOM.value) * 60);
        case timerAction.LONG_BREAK:
             return secondsToTime(parseInt(state.longBreakDOM.value) * 60);
    }
}

function timerActionToSeconds() {
    switch (state.timerAction) {
        case timerAction.WORK:
             return (parseInt(state.workTimeDOM.value) * 60);
        case timerAction.SHORT_BREAK:
             return (parseInt(state.shortBreakDOM.value) * 60);
        case timerAction.LONG_BREAK:
             return (parseInt(state.longBreakDOM.value) * 60);
    }
}

// Event Listeners

function addEventListenersToDOM() {
    //////////////////////////////////////////////////////////////////
    // When you change timer action, pause timer, set ticking time, and reset timer    

     for(let buttonElement of document.querySelectorAll('.modeButton')) {
         buttonElement.addEventListener('click', () => {
             let buttonText = buttonElement.textContent;
            
             switch (buttonText) {
                 case 'Work': 
                     state.timerAction = timerAction.WORK;
                     handleModeButtonClassChanges('workModeButton', 'modeButton');
                     break;
                 case 'Short Break':
                     state.timerAction = timerAction.SHORT_BREAK;
                     handleModeButtonClassChanges('shortBreakModeButton', 'modeButton');
                     break;
                 case 'Long Break':
                     state.timerAction = timerAction.LONG_BREAK;
                     handleModeButtonClassChanges('longBreakModeButton', 'modeButton');
                     break;
             }
             pauseTimer();
             state.tickingTime = timerActionToSeconds();
             state.timerDOM.textContent = timerActionToTimeString();
             setDocumentTitle(timerActionToTimeString());
         });
    }

    //////////////////////////////////////////////////////////////////
    // play / pause button
    document.getElementById('playPauseButton').addEventListener('click', () => {
        if(state.ticking) {
            pauseTimer();        
        }
        else {
            startTimer();
        }
    });

    //////////////////////////////////////////////////////////////////
    // Set Num Of Alarm Noises On Button Press
    for(let alarmSoundNumButton of document.querySelectorAll('.alarmSoundNum')) {
        alarmSoundNumButton.addEventListener('click', () => {
            state.numOfAlarm = parseInt(alarmSoundNumButton.textContent);
            switch(alarmSoundNumButton.textContent) {
                case '1':
                    handleModeButtonClassChanges('a1', 'alarmSoundNum');
                    break;
                case '3':
                    handleModeButtonClassChanges('a2', 'alarmSoundNum');
                    break;
                case '5':
                    handleModeButtonClassChanges('a3', 'alarmSoundNum');
                    break;
            }
        });
    }
}


// event listener helpers

function handleModeButtonClassChanges(classToIgnore, classToIterateThrough) {
    for(let buttonElement of document.querySelectorAll('.' + classToIterateThrough)) {
        // element that was clicked
        if(buttonElement.classList.contains(classToIgnore)) {
            switch(classToIgnore) {
                case 'workModeButton':
                    addClass(buttonElement, 'btn-warning', 'btn-outline-warning');
                    break;

                case 'shortBreakModeButton':
                    addClass(buttonElement, 'btn-primary', 'btn-outline-primary');
                    break;

                case 'longBreakModeButton':
                    addClass(buttonElement, 'btn-danger', 'btn-outline-danger');
                    break;
                case 'a1':
                    addClass(buttonElement, 'btn-warning', 'btn-outline-warning');
                    break;

                case 'a2':
                    addClass(buttonElement, 'btn-primary', 'btn-outline-primary');
                    break;

                case 'a3':
                    addClass(buttonElement, 'btn-danger', 'btn-outline-danger');
                    break;
            }
        }
        
        else {
            if(buttonElement.classList.contains('btn-warning') && !buttonElement.classList.contains('btn-outline-warning')) {
                removeClass(buttonElement, 'btn-warning', 'btn-outline-warning');
            }

            else if(buttonElement.classList.contains('btn-primary') && !buttonElement.classList.contains('btn-outline-primary')) {
                removeClass(buttonElement, 'btn-primary', 'btn-outline-primary')
            }

            else if(buttonElement.classList.contains('btn-danger') && !buttonElement.classList.contains('btn-outline-danger')) {
                removeClass(buttonElement, 'btn-danger', 'btn-outline-danger');
            }
        }
    }
}


function main() {
    addEventListenersToDOM();
    // sets initial mode to work time
    document.querySelectorAll('.modeButton')[0].click();
}

main();