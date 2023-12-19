// Object to keep track of the button states
const buttonStates = {
    left: false,
    right: false
};
// Position of disc
let discPosition = 0;
let discPositionOld = 0;

//Moving direction
let movingDirection = "up";

// Error objects
let errors = [];

// Function to check if both buttons are pressed
function checkBothButtonsPressed() {
    if (buttonStates.left && buttonStates.right) {
        console.log('Both buttons pressed together!');
        //Calculate distance between disc and line
        const disc = document.getElementById('floatingDisc');
        const line = document.getElementById('middleLine');

        const discRect = disc.getBoundingClientRect();
        const lineRect = line.getBoundingClientRect();

        let discPosition = discRect.bottom + discRect.height / 2 -10;
        let linePosition = lineRect.bottom + lineRect.height / 2 +10;

        let distance = Math.abs(discPosition - linePosition);
        if (movingDirection === "up") {
            if (discPosition>linePosition) {
                distance=distance*(-1);
            }
        }else{
            if (discPosition<linePosition) {
                distance=distance*(-1);
            }
        }
        errors.push(distance);
        console.log("errors", errors);
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


// Function to calculate the distance between the disc and the line
setInterval(() => {
    const disc = document.getElementById('floatingDisc');
    //const line = document.getElementById('middleLine');

    const discRect = disc.getBoundingClientRect();
    //const lineRect = line.getBoundingClientRect();

    discPositionOld = discPosition;
    discPosition = discRect.bottom + discRect.height / 2 -10;

    if (discPosition > discPositionOld) {
        movingDirection = "down";
    }
    else {
        movingDirection = "up";
    }
}, 10)
