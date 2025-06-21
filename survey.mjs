import express from 'express';
import { askChatGPT } from './openaiService.mjs';
const survey = express();

survey.use(express.static('public'));

survey.use(express.json()); // To parse JSON request bodies

// Analyze Survey Endpoint
survey.post('/analyze-survey', async (req, res) => {
    const { title, categories, questions, responses } = req.body;

    if (!title || !categories || !questions || !responses) {
        return res.status(400).send("Invalid survey data");
    }

    // Format the data into a prompt for ChatGPT
    const prompt = `
        Survey Title: ${title}
        
        Categories:
        ${categories.join(', ')}
        
        Questions and Responses:
        ${questions.map((q, i) => `Q${i + 1}: ${q}\nResponse: ${responses[i]}`).join('\n')}
        
        
        - Provide 1 essay-like paragraph response for each of the 4 categories: ${categories.join(', ')}.
        - Include 1 final single paragraph response that uses the previous responses to answer the survey's title and list specific examples relating to the survey title.

        
    `;

    try {
        const interpretation = await askChatGPT(prompt);
        res.send(interpretation);
    } catch (error) {
        console.error("Error with ChatGPT:", error);
        res.status(500).send("Error analyzing survey responses.");
    }
});


const port = 8000;
survey.listen(port, () => {
 console.log(`Server is running at http://localhost:${port}`);
});



/* for generating the questions w/o hard coding them --IN PROGRESS */
// const categories = [
//     { 
//         name: "Category 1", 
//         questions: [
//             "Question 1",
//             "Question 2",
//             "Question 3",
//             "Question 4",
//             "Question 5"
//         ]
//     },
//     { 
//         name: "Category 2", 
//         questions: [
//             "Question 1",
//             "Question 2",
//             "Question 3",
//             "Question 4",
//             "Question 5"
//         ]
//     },
//     { 
//         name: "Category 3", 
//         questions: [
//             "Question 1",
//             "Question 2",
//             "Question 3",
//             "Question 4",
//             "Question 5"
//         ]
//     },
//     { 
//         name: "Category 4", 
//         questions: [
//             "Question 1",
//             "Question 2",
//             "Question 3",
//             "Question 4",
//             "Question 5"
//         ]
//     },
// ];

// function createSlider(category, questionText, questionNumber) {
//     return `
//         <div class="question-tile">
//             <label>${category.name} - ${questionText}</label>
//             <div class="slider-container">
//                 <input id="${category.name.replace(" ", "")}_Q${questionNumber}_Score" type="range" min="1" max="10" value="1" oninput="this.nextElementSibling.value = this.value">
//                 <div class="slider-scale">
//                     ${Array.from({ length: 10 }, (_, i) => `<span>${i + 1}</span>`).join('')}
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function generateSurvey() {
//     const surveyContainer = document.getElementById("survey");
//     categories.forEach(category => {
//         const categoryHTML = `<h3>${category.name}</h3>`;
//         let questionsHTML = '';
//         category.questions.forEach((questionText, index) => {
//             questionsHTML += createSlider(category, questionText, index + 1);
//         });
//         surveyContainer.innerHTML += categoryHTML + questionsHTML;
//     });
// }

// // Generate the survey when the page loads
// window.onload = generateSurvey;
