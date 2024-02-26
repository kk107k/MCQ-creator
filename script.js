
// Function to toggle night mode
function toggleNightMode() {
    const body = document.body;
    body.classList.toggle('night-mode');
}

document.addEventListener('DOMContentLoaded', function () {
    // fetchQuestions(); // Remove this line, as we will load questions on button click
});

async function fetchQuestions() {
    try {
        const response = await fetch('questions.txt');
        const data = await response.text();

        displayQuestions(data);
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function parseQuestions(data) {
    const lines = data.split('\n');
    console.log(lines);  // Log the lines array to the console

    const questions = [];
    let currentIndex = 0;

    while (currentIndex < lines.length) {
        const prompt = lines[currentIndex]?.trim() || 'Missing prompt';
        const options = [];

        // Skip the prompt line
        currentIndex++;

        // Collect options until we encounter a single character or end of file
        while (currentIndex < lines.length && lines[currentIndex].trim().length > 1) {
            options.push(lines[currentIndex]?.trim() || 'Missing option');
            currentIndex++;
        }

        // Skip the correct answer line
        const correctAnswer = lines[currentIndex]?.trim() || 'Missing answer';
        currentIndex++;

        // Skip any remaining empty lines
        while (currentIndex < lines.length && lines[currentIndex].trim() === '') {
            currentIndex++;
        }

        questions.push({ prompt, options, correctAnswer });
    }

    return questions;
}

function displayQuestions(data) {
    try {
        const questionsContainer = document.getElementById('questions-container');
        const questions = parseQuestions(data);

        questionsContainer.innerHTML = ''; // Clear existing questions

        questions.forEach((question, index) => {
            const questionElement = createQuestionElement(question, index + 1);
            questionsContainer.appendChild(questionElement);
        });
    } catch (error) {
        console.error('Error displaying questions:', error);
    }
}

function createQuestionElement(question, number) {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const promptElement = document.createElement('p');
    promptElement.textContent = `${question.prompt}`;
    questionElement.appendChild(promptElement);

    const optionsList = document.createElement('ul');
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('li');
        optionElement.textContent = `${option}`;

        // Add a click event listener to each option
        optionElement.addEventListener('click', (event) => checkAnswer(event, question, index));

        optionsList.appendChild(optionElement);
    });
    questionElement.appendChild(optionsList);

    const resultElement = document.createElement('p');
    questionElement.appendChild(resultElement);

    return questionElement;
}

function checkAnswer(event, question, selectedOptionIndex) {
    const selectedOption = String.fromCharCode(65 + selectedOptionIndex);
    console.log(`Selected Option: ${selectedOption}`);

    const correctOption = question.correctAnswer;
    console.log(`Correct Answer: ${correctOption}`);
    
    const resultElement = event.target.parentElement.parentElement.querySelector('p:last-child');

    if (selectedOption === correctOption) {
        resultElement.textContent = 'Correct!';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'Wrong!';
        resultElement.style.color = 'red';
    }
}

var questionHeader = document.getElementById("questionHeader");

// New function for handling file upload
function loadQuestions() {


    questionHeader.style.display = "none";

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;
            displayQuestions(fileContent);
        };

        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
}
