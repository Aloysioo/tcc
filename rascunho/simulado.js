
(() => {
  const questions = window.STUDY_DATA?.questions || [];
  const config = document.querySelector("#quiz-config");
  const form = document.querySelector("#config-form");
  const quizRun = document.querySelector("#quiz-run");
  const result = document.querySelector("#quiz-result");
  const nextButton = document.querySelector("#next-question");
  const warning = document.querySelector("#answer-warning");

  let selectedQuestions = [];
  let answers = [];
  let current = 0;
  let seconds = 0;
  let timerId;

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestedCount = Number(new FormData(form).get("count"));
    const subject = document.querySelector("#subject").value;
    const pool = subject === "Todas" ? questions : questions.filter((question) => question.subject === subject);
    const count = Math.min(requestedCount, pool.length);
    selectedQuestions = shuffle(pool).slice(0, count);
    answers = [];
    current = 0;
    seconds = Math.max(count * 120, 60);
    config.hidden = true;
    result.hidden = true;
    quizRun.hidden = false;
    renderQuestion();
    startTimer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function renderQuestion() {
    const question = selectedQuestions[current];
    const total = selectedQuestions.length;
    document.querySelector("#progress-label").textContent = `${current + 1} de ${total}`;
    document.querySelector("#progress-bar").style.transform = `scaleX(${(current + 1) / total})`;
    document.querySelector("#question-subject").textContent = question.subject;
    document.querySelector("#question-number").textContent = `Questão ${String(current + 1).padStart(2, "0")}`;
    document.querySelector("#question-statement").textContent = question.statement;
    document.querySelector("#quiz-choices").innerHTML = question.choices.map((choice, index) => `
      <label class="quiz-choice"><input type="radio" name="answer" value="${index}"><i>${String.fromCharCode(65 + index)}</i><span>${choice}</span></label>
    `).join("");
    nextButton.firstChild.textContent = current === total - 1 ? "Finalizar simulado " : "Próxima questão ";
    warning.hidden = true;
  }

  nextButton.addEventListener("click", () => {
    const checked = document.querySelector('input[name="answer"]:checked');
    if (!checked) {
      warning.hidden = false;
      return;
    }
    answers.push(Number(checked.value));
    if (current < selectedQuestions.length - 1) {
      current += 1;
      renderQuestion();
      document.querySelector(".question-card").scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      finishQuiz();
    }
  });

  function startTimer() {
    clearInterval(timerId);
    updateTimer();
    timerId = setInterval(() => {
      seconds -= 1;
      updateTimer();
      if (seconds <= 0) finishQuiz(true);
    }, 1000);
  }

  function updateTimer() {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    document.querySelector("#timer").textContent = `${minutes}:${remainingSeconds}`;
  }

  function finishQuiz(timedOut = false) {
    clearInterval(timerId);
    while (answers.length < selectedQuestions.length) answers.push(-1);
    const score = selectedQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
    const percent = Math.round((score / selectedQuestions.length) * 100);
    document.querySelector("#score-percent").textContent = percent;
    document.querySelector("#result-title").textContent = percent >= 80 ? "Mandou muito bem." : percent >= 50 ? "Você está no caminho." : "Agora você sabe onde focar.";
    document.querySelector("#result-summary").textContent = timedOut
      ? `O tempo terminou. Você acertou ${score} de ${selectedQuestions.length} questões.`
      : `Você acertou ${score} de ${selectedQuestions.length} questões. Revise os comentários abaixo e transforme cada erro em direção.`;
    document.querySelector("#answer-review").innerHTML = selectedQuestions.map((question, index) => {
      const isCorrect = answers[index] === question.answer;
      const userAnswer = answers[index] >= 0 ? question.choices[answers[index]] : "Não respondida";
      return `<article class="review-item ${isCorrect ? "correct" : "incorrect"}"><header><h3>${index + 1}. ${question.statement}</h3><span>${isCorrect ? "Resposta correta" : "Revisar"}</span></header><p><strong>Sua resposta:</strong> ${userAnswer}</p><p><strong>Resposta correta:</strong> ${question.choices[question.answer]}</p><p class="explanation">${question.explanation}</p></article>`;
    }).join("");
    quizRun.hidden = true;
    result.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelector("#restart").addEventListener("click", () => {
    result.hidden = true;
    config.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();