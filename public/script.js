async function askChatGPT() {
    const titleElement = document.querySelector(".survey-title h2");
    const title = titleElement ? titleElement.innerText : "Untitled Survey";

    const questions = [];
    const responses = [];
    const categories = [];

    // Iterate through categories and questions
    for (let cat = 1; cat <= 4; cat++) { 
        const categoryElement = document.querySelector(`h3:nth-of-type(${cat})`);
        const categoryName = categoryElement ? categoryElement.innerText.trim() : `Category ${cat}`;

        for (let q = 1; q <= 5; q++) { 
            const slider = document.querySelector(`#Cat${cat}_Q${q}_Score`);
            if (slider) {
                const label = document.querySelector(`label[for="Cat${cat}_Q${q}_Score"]`);
                const questionText = label ? label.innerText.trim() : `Question ${cat}-${q} not found`;

                const responseValue = slider.value;

                questions.push(questionText);
                responses.push(responseValue);
            } else {
                questions.push(`Question ${cat}-${q} missing`);
                responses.push("No Response");
            }
        }

        categories.push(categoryName);
    }

    const surveyData = {
        title,
        categories,
        questions,
        responses,
    };
    console.log("Survey Data:", surveyData);

    try {
        const response = await fetch('/analyze-survey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData),
        });

        const result = await response.text();
        document.getElementById('chatgpt-response').innerText = result;
        document.getElementById('response-container').style.display = 'block';
    } catch (error) {
        console.error("Error communicating with the server:", error);
        document.getElementById('chatgpt-response').innerText = "An error occurred. Please try again.";
        document.getElementById('response-container').style.display = 'block';
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');
    const modeLabel = document.getElementById('mode-label');

    // Apply the saved theme correctly
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode'); // Use 'dark-mode' consistently
        modeToggle.checked = true;      // Ensure toggle is checked for dark mode
        modeLabel.textContent = 'Light Mode';
    } else {
        body.classList.remove('dark-mode'); // Remove 'dark-mode' for light theme
        modeToggle.checked = false;        // Ensure toggle is unchecked for light mode
        modeLabel.textContent = 'Dark Mode';
    }

    // Toggle theme and save to localStorage on change
    modeToggle.addEventListener('change', () => {
        const isDarkMode = modeToggle.checked; // Determine toggle state
        body.classList.toggle('dark-mode', isDarkMode); // Add or remove class based on state
        modeLabel.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); // Save to localStorage
    });
});

// Plus minus button functionality for increase/decrease font
let currentFontSize = 16;

function increaseFontSize() {
    if(currentFontSize < 30){
        currentFontSize += 2;
        document.getElementById("survey").style.fontSize = `${currentFontSize}px`;
    }
}

function decreaseFontSize() {
    if(currentFontSize > 10){
        currentFontSize -= 2;
        document.getElementById("survey").style.fontSize = `${currentFontSize}px`;
    }
}

// Function to update the progress bar based on the number of sliders that have been adjusted
function updateProgressBar() {
    const totalQuestions = 20;
    let answeredQuestions = 0;

    // Loop through each question slider and check if the value has changed from the default (1)
    for (let cat = 1; cat <= 4; cat++) {
        for (let q = 1; q <= 5; q++) {
            const slider = document.getElementById(`Cat${cat}_Q${q}_Score`);
            if (slider && slider.value !== "1") { 
                answeredQuestions++;
            }
        }
    }

    // Calculate the progress percentage
    const progressPercent = (answeredQuestions / totalQuestions) * 100;
    const progressBar = document.getElementById("progress-bar");
    const progressLabel = document.getElementById("progress-label");

    progressBar.style.height = `${progressPercent}%`;

    // Show "Done!" when the bar is 100% filled
    if (progressPercent === 100) {
        progressLabel.style.display = 'block';
    } else {
        progressLabel.style.display = 'none';
    }
}

// Attach event listeners to each slider to call updateProgressBar on input change
window.onload = function() {
    for (let cat = 1; cat <= 4; cat++) {
        for (let q = 1; q <= 5; q++) {
            const slider = document.getElementById(`Cat${cat}_Q${q}_Score`);
            if (slider) {
                slider.addEventListener('input', updateProgressBar);
            }
        }
    }
};

function downloadPDF() {
    const { jsPDF } = window.jspdf; // Access jsPDF from the global window object

    const titleElement = document.querySelector(".survey-title h2");
    const title = titleElement ? titleElement.innerText : "Untitled Survey";

    const chatGPTResponse = document.getElementById("chatgpt-response").innerText || "No ChatGPT response available";

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 10, 20);

    doc.setFontSize(12);
    doc.text("Analysis:", 10, 30);
    let yPosition = 40;
    const responseLines = doc.splitTextToSize(chatGPTResponse, 180);

    responseLines.forEach((line) => {
        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 10, yPosition);
        yPosition += 10;
    });

    doc.save(`${title}-Analysis.pdf`);
}