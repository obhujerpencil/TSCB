// Fetch the quiz data from the JSON file
fetch('https://raw.githubusercontent.com/obhujerpencil/TSCB/main/tscb.json')
    .then(response => response.json())
    .then(data => {
        const quizData = data.quiz;

        // Extract quiz title and questions
        const quizTitle = quizData.title;
        const questions = quizData.questions;

        // References to HTML elements
        const startBtn = document.querySelector(".start");
        const infoBox = document.querySelector(".info-box");
        const exitBtn = infoBox.querySelector(".buttons .quit");
        const continueBtn = infoBox.querySelector(".buttons .cont");
        const quizBox = document.querySelector(".quiz-box");
        const nextBtn = quizBox.querySelector(".next");
        const optionList = quizBox.querySelector(".option-list");
        const resultBox = document.querySelector(".result-box");
        const timeCount = quizBox.querySelector(".timer .sec");
        const timeLine = quizBox.querySelector("header .timeline");
        const timeOut = quizBox.querySelector(".timer .text");
        const body = document.getElementsByTagName("body")[0];

        // Function to start the quiz
        function startQuiz() {
            infoBox.classList.add("activeInfo");
        }

        // Function to handle option selection
        function optionSelected(answer) {
            clearInterval(counter);
            clearInterval(counterLine);
            let userAns = answer.textContent;
            let correctAns = questions[que_count].correctAnswer;
            let allOptions = optionList.children.length;
            if (userAns === correctAns) {
                userScore++;
                answer.classList.add("correct");
            } else {
                answer.classList.add("incorrect");
                quizBox.style.animation = "shake 0.25s 2";
                body.classList.add("wrong");
                timeLine.classList.add("wrong");

                // Show correct answer
        for (let x = 0; x < allOptions; x++) {
            if (optionList.children[x].textContent === correctAns) {
                optionList.children[x].classList.add("option", "correct");
                optionList.children[x].insertAdjacentHTML("beforeend", tickIcon);
            }
        }


            }
            for (let x = 0; x < allOptions; x++) {
                optionList.children[x].classList.add("disabled");
            }
            nextBtn.style.display = "block";
        }

        // Function to display questions
        function showQuestions(index) {
            const queText = document.querySelector(".question");
            const queTag = `<span>${questions[index].question}</span>`;
            let optionsTag = '';
            questions[index].options.forEach(option => {
                optionsTag += `<div class="option">${option}<span></span></div>`;
            });
            queText.innerHTML = queTag;
            optionList.innerHTML = optionsTag;

            // Randomize options
            const optionElements = optionList.querySelectorAll(".option");
            optionElements.forEach(option => {
                option.addEventListener("click", () => optionSelected(option));
            });
        }

        // Function to handle next button click
        nextBtn.onclick = () => {
            if (que_count < questions.length - 1) {
                que_count++;
                que_numb++;
                showQuestions(que_count);
                queCount(que_numb);
                clearInterval(counter);
                clearInterval(counterLine);
                startTimer(timeValue);
                startTimeLine(0);
                nextBtn.style.display = "none";
                body.classList.remove("right");
                body.classList.remove("wrong");
                timeLine.classList.remove("right");
                timeLine.classList.remove("wrong");
            } else {
                clearInterval(counter);
                clearInterval(counterLine);
                showResultBox();
                quizBox.classList.remove("activeQuiz");
                resultBox.classList.add("activeResult");
                timeOut.textContent = "Time left";
            }
        };

        // Function to display result box
        function showResultBox() {
            infoBox.classList.remove("activeQuiz");
            quizBox.classList.remove("activeQuiz");
            resultBox.classList.add("activeResult");
            body.classList.remove("right");
            body.classList.remove("wrong");
            const scoreText = resultBox.querySelector(".score-text");
            let scoreTag = '';
            if (userScore === questions.length) {
                scoreTag = `<span>🥳👌Perfect!! you got <p>${userScore}</p> out of <p>${questions.length}</p> questions</span>`;
            } else if (userScore > 6) {
                scoreTag = `<span>💫Congrats! you got <p>${userScore}</p> out of <p>${questions.length}</p> questions</span>`;
            } else if (userScore > 3) {
                scoreTag = `<span>👍Nice, you got <p>${userScore}</p> out of <p>${questions.length}</p> questions</span>`;
            } else {
                scoreTag = `<span>😟Sadly, you only got <p>${userScore}</p> out of <p>${questions.length}</p> questions</span>`;
            }
            scoreText.innerHTML = scoreTag;
        }

        // Initialize quiz
        let que_count = 0;
        let que_numb = 1;
        let counter;
        let counterLine;
        let timeValue = 10;
        let widthValue = 0;
        let userScore = 0;
        const tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
        const crossIcon = '<div class="icon wrong"><i class="fas fa-times"></i></div>';

        startBtn.onclick = startQuiz;
        exitBtn.onclick = () => infoBox.classList.remove("activeInfo");
        continueBtn.onclick = () => {
            infoBox.classList.remove("activeInfo");
            quizBox.classList.add("activeQuiz");
            showQuestions(0);
            queCount(1);
            startTimer(11);
            startTimeLine(0);
            alert("Ready??");
            alert("Goodluck!!!");
        };

        // Function to start timer
        function startTimer(time) {
            counter = setInterval(timer, 1000);
            function timer() {
                timeCount.textContent = time;
                time--;
                timeOut.textContent = "Time left";
                if (time < 9) {
                    let addZero = timeCount.textContent;
                    timeCount.textContent = "0" + addZero;
                }
                if (time < 0) {
                    clearInterval(counter);
                    timeCount.textContent = "00";
                    timeOut.textContent = "Time Up";

                    let correctAns = questions[que_count].correctAnswer;
                    let allOptions = optionList.children.length;
                    for (let x = 0; x < allOptions; x++) {
                        if (optionList.children[x].textContent === correctAns) {
                            optionList.children[x].classList.add("option", "correct");
                            optionList.children[x].insertAdjacentHTML("beforeend", tickIcon);
                        }
                    }
                    for (let x = 0; x < allOptions; x++) {
                        optionList.children[x].classList.add("disabled");
                    }
                    nextBtn.style.display = "block";
                }
            }
        }

        // Function to start timeline
        function startTimeLine(time) {
            counterLine = setInterval(timer, 30.5);
            function timer() {
                time += 1;
                timeLine.style.width = time + "px";
                if (time > 350) {
                    clearInterval(counterLine);
                }
            }
        }

        // Function to display question count
        function queCount(index) {
            const bottomQueCount = quizBox.querySelector(".total-questions");
            const totalQuestionsCount = `<span><p>${index}</p>of<p>${questions.length}</p>Questions</span>`;
            bottomQueCount.innerHTML = totalQuestionsCount;
        }
    })
    .catch(error => {
        console.error('Error fetching quiz data:', error);
    });


