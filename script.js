const questions = [
  {
    question: "HTML stands for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "High Text Machine Language", correct: false },
      { text: "Hyperlinks Text Mark Language", correct: false },
      { text: "Home Tool Markup Language", correct: false }
    ]
  },
  {
    question: "CSS stands for?",
    answers: [
      { text: "Cascading Style Sheet", correct: true },
      { text: "Creative Style System", correct: false },
      { text: "Computer Style Sheets", correct: false },
      { text: "Colorful Style Sheets", correct: false }
    ]
  },
  {
    question: "Which language is used to make a website interactive?",
    answers: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: false },
      { text: "JavaScript", correct: true },
      { text: "PHP", correct: false }
    ]
  },
  {
    question: "JavaScript was invented in which year?",
    answers: [
      { text: "1995", correct: true },
      { text: "2000", correct: false },
      { text: "1989", correct: false },
      { text: "2010", correct: false }
    ]
  },
  {
    question: "Which language is use to style a website?",
    answers: [
      { text: "Javascript", correct: false },
      { text: "HTML", correct: false },
      { text: "CSS", correct: true },
      { text: "All of the above", correct: false }
    ]
  }
];

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("ans-button");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let scoreSaved = false;

function requireAuth(){
    firebase.auth().onAuthStateChanged(user => {
        if (!user){
            window.location.href = "login.html";
        }
    });
}

requireAuth();

function saveScore(){
    try {
        const user = firebase.auth().currentUser;
        const payload = {
            score: score,
            total: questions.length,
            createdAt: Date.now()
        };

        if (user){
            payload.uid = user.uid;
            payload.email = user.email || null;
            return firebase.database()
                .ref(`users/${user.uid}/scores`)
                .push(payload);
        }

        return firebase.database().ref("scores").push(payload);
    } catch (error){
        console.error("Score save failed:", error);
    }
}

function starQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    scoreSaved = false;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click" , selectAnswer);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while (answerButton.firstChild){
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    } else{
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButton.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;

    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
    if (!scoreSaved){
        scoreSaved = true;
        saveScore();
    }
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    } else{
        showScore();
    }
}

nextButton.addEventListener("click" , ()=> {
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    } else{
        starQuiz();
    }
});
starQuiz();
