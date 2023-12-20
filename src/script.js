document.addEventListener('DOMContentLoaded', (event) => {
    // Object to keep track of the button states
    const buttonStates = {
        left: false,
        right: false
    };

    // Position of line
    const line = document.getElementById('middleLine');
    const lineRect = line.getBoundingClientRect();
    const linePosition = lineRect.bottom + lineRect.height / 2 + 10;
    console.log("linePosition", linePosition);

    // Error objects
    let errors = [];
    const disc = document.getElementById('floatingDisc');
    let metronomeSpeed = 60 / 54 * 1000; // 54 bpm

    let beepTimestamp = 0;
    let pressTimestamp = 0;

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    animateDisc();
    let timer = setInterval(() => {
        animateDisc();
    }, metronomeSpeed);


    function animateDisc() {
        const durationToTop = (3 / 7) * (metronomeSpeed / 1000); // Duration for moveToTop
        const durationToLine = (4 / 7) * (metronomeSpeed / 1000); // Duration for moveToLine
        //Set animation to disc using css
        disc.style.animation = `moveToTop ${durationToTop}s linear`;
        disc.onanimationend = () => {
            //Calculate error
            if (beepTimestamp !== 0 && pressTimestamp !== 0) {
                let error = pressTimestamp - beepTimestamp;
                //If abs error is less than metronome time then add to errors
                if (Math.abs(error) < metronomeSpeed) {
                    errors.push(error);
                    console.log("error", errors);
                    updateResults();
                }
            }
            disc.style.animation = `moveToLine ${durationToLine}s linear forwards`;
        }
        playBeep();
        beepTimestamp = Date.now();
    }


    // Metronome speed input change
    let metronomeSpeedInput = document.getElementById('metronomeSpeedInput');
    metronomeSpeedInput.addEventListener('input', function () {
        let newSpeed = metronomeSpeedInput.value;
        //transform to seconds
        if (newSpeed < 1) newSpeed = 1;
        metronomeSpeed = 60 / newSpeed * 1000;
        clearInterval(timer);
        animateDisc();
        timer = setInterval(() => {
            animateDisc();
        }, metronomeSpeed);
    });

    // Function to check if both buttons are pressed
    function checkBothButtonsPressed() {
        if (buttonStates.left && buttonStates.right) {
            pressTimestamp = Date.now();
        }
    }

    // Function to toggle button variant
    function toggleButtonVariant(buttonId, isPressed) {
        const button = document.getElementById(buttonId);
        if (isPressed) {
            button.classList.remove('btn-primary', 'btn-secondary');
            button.classList.add('btn-success');
        } else {
            // Replace with original class(es) as needed
            button.classList.remove('btn-success');
            button.classList.add('btn-primary'); // or 'btn-secondary'
        }
    }

    // Event listeners for key down and up
    document.body.onkeydown = function (e) {
        if (e.key === 'a' || e.key === 'A') {
            toggleButtonVariant('leftButton', true);
            buttonStates.left = true;
            checkBothButtonsPressed();
        }
        if (e.key === 'l' || e.key === 'L') {
            toggleButtonVariant('rightButton', true);
            buttonStates.right = true;
            checkBothButtonsPressed();
        }
    };

    document.body.onkeyup = function (e) {
        if (e.key === 'a' || e.key === 'A') {
            toggleButtonVariant('leftButton', false);
            buttonStates.left = false;
            document.getElementById('leftButton').classList.remove('btn-success');
            document.getElementById('leftButton').classList.add('btn-primary'); // or 'btn-secondary'

        }
        if (e.key === 'l' || e.key === 'L') {
            toggleButtonVariant('rightButton', false);
            buttonStates.right = false;
            document.getElementById('rightButton').classList.remove('btn-success');
            document.getElementById('rightButton').classList.add('btn-primary'); // or 'btn-secondary'
        }
    };

    // Optional: Add event listeners for button clicks if you want the buttons to do something when clicked
    document.getElementById('leftButton').addEventListener('click', function () {
        // Do something when the left button is clicked
    });

    document.getElementById('rightButton').addEventListener('click', function () {
        // Do something when the right button is clicked
    });

    function updateResults() {
        const lastError = errors[errors.length - 1] || 0;
        const averageError = errors.length > 0 ? errors.reduce((a, b) => a + b, 0) / errors.length : 0;
        const numberOfClaps = errors.length;

        document.getElementById('lastError').value = lastError.toFixed(2);
        document.getElementById('averageError').value = averageError.toFixed(2);
        document.getElementById('numberOfClaps').value = numberOfClaps;

        // Update the error list table
        const errorList = document.getElementById('errorList');
        errorList.innerHTML = ''; // Clear existing list
        errors.forEach((error, index) => {
            const row = `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${error.toFixed(2)}</td>
                    </tr>`;
            errorList.innerHTML += row;
        });
    }


    function playBeep() {
        let oscillator = audioContext.createOscillator();
        let gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 440; // Frequency in hertz (A4 pitch)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01); // Fade in
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3); // Fade out

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    document.getElementById('soundToggleButton').addEventListener('click', function () {
        let soundIcon = document.getElementById('soundIcon');
        if (soundIcon.classList.contains('fa-volume-mute')) {
            soundIcon.classList.remove('fa-volume-mute');
            soundIcon.classList.add('fa-volume-up');
            // Logic to enable sound
        } else {
            soundIcon.classList.remove('fa-volume-up');
            soundIcon.classList.add('fa-volume-mute');
            // Logic to mute sound
        }
    });

    document.getElementById('soundToggleButton').addEventListener('click', function () {
        // Resume or start the audio context
        audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
        });
    });


});