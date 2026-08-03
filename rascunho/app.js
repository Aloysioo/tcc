(() => {
  const data = window.STUDY_DATA || { lessons: [], questions: [] };
  const lessonGrid = document.querySelector("#lesson-grid");
  const search = document.querySelector("#search");
  const filters = document.querySelector("#filters");
  const emptyState = document.querySelector("#empty-state");
  const modal = document.querySelector("#lesson-modal");
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");

  let activeSubject = "Todas";
  let searchTerm = "";

  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function renderFilters() {
    const subjects = ["Todas", ...new Set(data.lessons.map((lesson) => lesson.subject))];
    filters.innerHTML = subjects.map((subject) => `
      <button type="button" class="filter-button ${subject === activeSubject ? "active" : ""}" data-subject="${subject}">${subject}</button>
    `).join("");
  }

  function renderLessons() {
    const term = normalize(searchTerm);
    const visibleLessons = data.lessons.filter((lesson) => {
      const matchesSubject = activeSubject === "Todas" || lesson.subject === activeSubject;
      const haystack = normalize(`${lesson.title} ${lesson.summary} ${lesson.subject}`);
      return matchesSubject && haystack.includes(term);
    });

    lessonGrid.innerHTML = visibleLessons.map((lesson, index) => `
      <article class="lesson-card color-${lesson.color}" style="--delay: ${index * 55}ms">
        <button type="button" data-lesson="${lesson.id}" aria-label="Abrir aula ${lesson.title}">
          <div class="lesson-topline"><span>${lesson.subject}</span><span>${lesson.time} min</span></div>
          <div class="lesson-number">${String(data.lessons.indexOf(lesson) + 1).padStart(2, "0")}</div>
          <h3>${lesson.title}</h3>
          <p>${lesson.summary}</p>
          <div class="lesson-footer"><span>${lesson.level}</span><i aria-hidden="true">↗</i></div>
        </button>
      </article>
    `).join("");

    emptyState.hidden = visibleLessons.length > 0;
  }

  function openLesson(id) {
    const lesson = data.lessons.find((item) => item.id === id);
    const question = data.questions.find((item) => item.topic === id);
    if (!lesson) return;

    document.querySelector("#modal-subject").textContent = lesson.subject;
    document.querySelector("#modal-time").textContent = `${lesson.time} min de leitura`;
    document.querySelector("#modal-title").textContent = lesson.title;
    document.querySelector("#modal-summary").textContent = lesson.summary;
    document.querySelector("#modal-content").innerHTML = lesson.content;

    const exercise = document.querySelector("#quick-exercise");
    const choices = document.querySelector("#choice-list");
    const feedback = document.querySelector("#feedback");
    feedback.hidden = true;
    feedback.className = "feedback";

    if (question) {
      exercise.hidden = false;
      document.querySelector("#exercise-statement").textContent = question.statement;
      choices.innerHTML = question.choices.map((choice, index) => `
        <button type="button" data-choice="${index}"><span>${String.fromCharCode(65 + index)}</span>${choice}</button>
      `).join("");
      choices.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => checkAnswer(button, question));
      });
    } else {
      exercise.hidden = true;
    }

    modal.showModal();
    document.body.classList.add("modal-open");
  }

  function checkAnswer(button, question) {
    const selected = Number(button.dataset.choice);
    const feedback = document.querySelector("#feedback");
    const choiceButtons = document.querySelectorAll("#choice-list button");
    choiceButtons.forEach((item, index) => {
      item.disabled = true;
      if (index === question.answer) item.classList.add("correct");
    });
    if (selected !== question.answer) button.classList.add("incorrect");
    feedback.hidden = false;
    feedback.classList.add(selected === question.answer ? "success" : "error");
    feedback.innerHTML = `<strong>${selected === question.answer ? "Boa! Resposta correta." : "Quase! Vale revisar."}</strong><p>${question.explanation}</p>`;
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-subject]");
    if (!button) return;
    activeSubject = button.dataset.subject;
    renderFilters();
    renderLessons();
  });

  lessonGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lesson]");
    if (button) openLesson(button.dataset.lesson);
  });

  search.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    renderLessons();
  });

  modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener("close", () => document.body.classList.remove("modal-open"));

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });

  renderFilters();
  renderLessons();
})();