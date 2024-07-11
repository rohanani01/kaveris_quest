let currentNode = 'start';

async function sendMessage() {
    const message = document.querySelector('input[name="option"]:checked');
    if (!message) {
        alert("Please select a choice.");
        return;
    }

    console.log(`Sending message: ${message.value}`);  // Debug print

    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message.value, current_node: currentNode })
    });

    if (!response.ok) {
        alert("Error communicating with the server.");
        return;
    }

    const data = await response.json();
    console.log(data);  // Debug print
    document.getElementById('story-text').innerText = data.response;
    updateOptions(data.options);
    updateStatus(data.status);
    currentNode = data.current_node;
}

function updateOptions(options) {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.innerHTML = `
            <input type="radio" id="${option}" name="option" value="${option}">
            <label for="${option}">${option.charAt(0).toUpperCase() + option.slice(1)}</label>
        `;
        optionsContainer.appendChild(optionElement);
    });

    console.log(`Updated options: ${options}`);  // Debug print
}

function updateStatus(status) {
    const body = document.body;
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    if (status === 'won') {
        body.style.backgroundImage = 'url("/static/images/won.png")';
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
        submitButton.disabled = false;
    } else if (status === 'failed') {
        body.style.backgroundImage = 'url("/static/images/moveon.png")';
        nextButton.style.display = 'none';
        submitButton.style.display = 'none';
        setTimeout(() => resetGame(), 3000);
    } else {
        body.style.backgroundImage = 'url("/static/images/background.png")';
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }

    console.log(`Updated status: ${status}`);  // Debug print
}

function resetGame() {
    document.getElementById('story-text').innerText = 'Kaveri stands at the entrance of a mysterious forest. What will she do? (enter/stay)';
    updateOptions(['enter', 'stay']);
    document.body.style.backgroundImage = 'url("/static/images/background.png")';
    document.getElementById('next-button').style.display = 'inline-block';
    document.getElementById('submit-button').style.display = 'none';
    currentNode = 'start';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('next-button').addEventListener('click', function() {
        sendMessage();
    });

    document.getElementById('submit-button').addEventListener('click', function() {
        if (!this.disabled) {
            // Add the functionality for going to the next level
            alert("Proceeding to the next level...");
            // Implement the logic for moving to the next level here
        }
    });

    // Disable the submit button initially
    document.getElementById('submit-button').style.display = 'none';
});
