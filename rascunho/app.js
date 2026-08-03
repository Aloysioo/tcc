// app.js — versão defensiva
(() => {
  const SITE = window.SITE_DATA || {}
  const aulas = Array.isArray(SITE.aulas) ? SITE.aulas : []
  const questions = Array.isArray(SITE.questions) ? SITE.questions : []

  const listEl = document.getElementById('list')
  const searchEl = document.getElementById('search')
  const lessonArea = document.getElementById('lesson-area')
  const lessonTitle = document.getElementById('lesson-title')
  const lessonSummary = document.getElementById('lesson-summary')
  const lessonContent = document.getElementById('lesson-content')
  const relatedEl = document.getElementById('related')
  const backBtn = document.getElementById('back')

  if (!listEl) {
    console.error('Elemento #list não encontrado no HTML.')
    return
  }

  function renderList(items) {
    listEl.innerHTML = ''
    items.forEach(a => {
      const card = document.createElement('article')
      card.className = 'card'
      card.innerHTML = <h3>${a.title}</h3><div class="muted">${a.subject} • ${(a.tags||[]).join(' • ')}</div><p class="muted" style="margin-top:8px">${a.summary}</p>
      card.addEventListener('click', () => showLesson(a.id))
      listEl.appendChild(card)
    })
  }

  function showLesson(id) {
    const a = aulas.find(x => x.id === id)
    if (!a) return
    if (lessonTitle) lessonTitle.textContent = a.title
    if (lessonSummary) lessonSummary.textContent = a.summary
    if (lessonContent) lessonContent.innerHTML = a.content

    if (!relatedEl) return
    relatedEl.innerHTML = ''
    const related = questions.filter(q => q.topic === a.id || q.subject === a.subject).slice(0, 6)
    if (related.length === 0) {
      relatedEl.innerHTML = '<p class="muted">Nenhuma questão relacionada.</p>'
      return
    }
    related.forEach(q => {
      const ex = document.createElement('div')
      ex.className = 'exercise'
      ex.innerHTML = <div><strong>${q.statement}</strong></div>
      const choices = document.createElement('div')
      (q.choices || []).forEach(c => {
        const btn = document.createElement('button')
        btn.textContent = ${c.label} — ${c.text}
        btn.addEventListener('click', () => {
          const ok = c.id === q.correctChoiceId
          alert((ok ? 'Correto! ' : 'Incorreto. ') + '\n' + (q.explanation || ''))
        })
        choices.appendChild(btn)
      })
      ex.appendChild(choices)
      relatedEl.appendChild(ex)
    })
    if (lessonArea) lessonArea.hidden = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (backBtn && lessonArea) {
    backBtn.addEventListener('click', () => {
      lessonArea.hidden = true
    })
  }

  // Setup Fuse (se disponível)
  if (typeof Fuse === 'undefined') {
    console.warn('Fuse.js não encontrado — busca ficará desabilitada.')
    renderList(aulas)
  } else {
    try {
      const fuse = new Fuse(aulas, { keys: ['title','tags','summary','subject'], threshold: 0.3 })
      function doSearch(q) {
        if (!q) renderList(aulas)
        else {
          const res = fuse.search(q).map(r => r.item)
          renderList(res)
        }
      }
      if (searchEl) {
        searchEl.addEventListener('input', e => doSearch(e.currentTarget.value))
      } else {
        console.warn('Elemento #search não encontrado — não será possível pesquisar.')
        renderList(aulas)
      }
    } catch (err) {
      console.error('Erro ao configurar Fuse:', err)
      renderList(aulas)
    }
  }

  // initial render (se ainda não renderizou)
  if (!listEl.innerHTML.trim()) renderList(aulas)
})();