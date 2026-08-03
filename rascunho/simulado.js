(() => {
  const allQs = (window.SITE_DATA && Array.isArray(window.SITE_DATA.questions)) ? window.SITE_DATA.questions : []
  const startBtn = document.getElementById('start')
  const countEl = document.getElementById('count')
  const minutesEl = document.getElementById('minutes')
  const simEl = document.getElementById('sim')
  const resultEl = document.getElementById('result')

  if (!startBtn || !countEl || !minutesEl || !simEl || !resultEl) {
    console.error('Elementos do DOM faltando: verifique se #start, #count, #minutes, #sim e #result existem no HTML.')
    return
  }

  if (!allQs.length) {
    console.warn('Nenhuma questão encontrada em window.SITE_DATA.questions — o simulado ficará vazio.')
  }

  let timerId = null

  function shuffle(a) {
    const b = a.slice()
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[b[i], b[j]] = [b[j], b[i]]
    }
    return b
  }

  startBtn.addEventListener('click', () => {
    const count = Math.max(1, Math.min(Number(countEl.value) || 10, allQs.length || 10))
    const minutes = Math.max(1, Number(minutesEl.value) || 90)
    const questions = shuffle(allQs).slice(0, count)
    runSimulado(questions, minutes)
  })

  function runSimulado(questions, minutes) {
    simEl.hidden = false
    resultEl.hidden = true
    simEl.innerHTML = ''

    const container = document.createElement('div')
    container.className = 'card'

    const info = document.createElement('div')
    info.innerHTML = <div>Tempo restante: <span id="time" style="font-family:monospace">00:00</span> • Questões: ${questions.length}</div>
    container.appendChild(info)

    const ol = document.createElement('ol')
    ol.style.marginTop = '12px'

    questions.forEach((q, idx) => {
      const li = document.createElement('li')
      li.style.marginTop = '12px'

      const statement = document.createElement('div')
      statement.innerHTML = <strong>${idx + 1}.</strong> ${q.statement}
      li.appendChild(statement)

      const choicesDiv = document.createElement('div')
      choicesDiv.style.marginTop = '8px'

      ;(q.choices || []).forEach(c => {
        const label = document.createElement('label')
        label.style.display = 'block'
        label.style.marginTop = '6px'

        const input = document.createElement('input')
        input.type = 'radio'
        input.name = q.id
        input.value = c.id // importante: define o value para recuperar a escolha depois
        input.style.marginRight = '8px'

        const strong = document.createElement('strong')
        strong.textContent = c.label

        const text = document.createTextNode(` — ${c.text}`)

        label.appendChild(input)
        label.appendChild(strong)
        label.appendChild(text)

        choicesDiv.appendChild(label)
      })

      li.appendChild(choicesDiv)
      ol.appendChild(li)
    })

    container.appendChild(ol)

    const finishBtn = document.createElement('button')
    finishBtn.className = 'btn'
    finishBtn.textContent = 'Finalizar simulado'
    finishBtn.style.marginTop = '12px'
    container.appendChild(finishBtn)
    simEl.appendChild(container)

    // timer
    let seconds = minutes * 60
    const timeEl = container.querySelector('#time')
    function fmt(s) {
      const m = Math.floor(s / 60).toString().padStart(2, '0')
      const ss = (s % 60).toString().padStart(2, '0')
      return ${m}:${ss}
    }
    if (timeEl) timeEl.textContent = fmt(seconds)

    clearInterval(timerId)
    timerId = setInterval(() => {
      seconds--
      if (timeEl) timeEl.textContent = fmt(seconds)
      if (seconds <= 0) {
        clearInterval(timerId)
        finalize()
      }
    }, 1000)

    finishBtn.addEventListener('click', () => {
      clearInterval(timerId)
      finalize()
    })

    function finalize() {
      const answers = {}
      let score = 0
      questions.forEach(q => {
        const selected = container.querySelector(input[name="${q.id}"]:checked)
        const sel = selected ? selected.value : null // pega o value do input (ex.: 'a','b')
        if (sel) answers[q.id] = sel
        if (sel && sel === q.correctChoiceId) score++
      })
      showResult({ score, total: questions.length, answers }, questions)
      simEl.hidden = true
    }
  }

  function showResult(result, questions) {
    resultEl.hidden = false
    resultEl.innerHTML = ''
    const card = document.createElement('div')
    card.className = 'card'
    const percent = result.total ? Math.round((result.score / result.total) * 100) : 0
    card.innerHTML = <h3>Resultado: ${result.score} / ${result.total} (${percent}%)</h3>

    const list = document.createElement('ol')
    list.style.marginTop = '12px'
    questions.forEach((q, idx) => {
      const li = document.createElement('li')
      li.style.marginTop = '8px'
      const sel = result.answers[q.id] || '—'
      const ok = sel === q.correctChoiceId
      li.innerHTML = `<div><strong>${idx + 1}.</strong> ${q.statement}</div>
                      <div style="margin-top:6px">Sua resposta: <span style="color:${ok ? 'green' : 'red'}">${sel}</span> • Correta: ${q.correctChoiceId}</div>
                      <div style="margin-top:6px;color:#374151">${q.explanation || ''}</div>`
      list.appendChild(li)
    })
    card.appendChild(list)

    const again = document.createElement('button')
    again.className = 'btn'
    again.style.marginTop = '12px'
    again.textContent = 'Fazer outro'
    again.addEventListener('click', () => {
      resultEl.hidden = true
      simEl.hidden = true
    })
    card.appendChild(again)

    resultEl.appendChild(card)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})()