function executeZeroQProcess() {
  // Variable que mantiene el rastro del ID del ticket actual
  let currentTicketId = null

  // Función que redirige a una URL, con opción de abrir en una nueva ventana
  function redirectToUrl(url, newWindow = false) {
    if (newWindow) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  }

  // Función que genera un botón para redirigir al usuario a una URL
  function generateRedirectButton(url) {
    const button = document.createElement('button')
    button.innerText = 'Redirigir'
    button.addEventListener('click', () => redirectToUrl(url, true))
    dataContainer.appendChild(button)
  }

  const dataContainer = document.querySelector('#data-container')

  // Función que muestra las filas disponibles para que el usuario pueda seleccionar
  const displayLines = async (zqTemporary) => {
    const office = await zqTemporary.getOffice('demo-web-frontend')
    const lines = await office.getLines()
    const linesElem = document.createElement('div')
    linesElem.setAttribute('class', 'lines-container')

    for (const line of lines) {
      const lineCard = document.createElement('div')
      lineCard.setAttribute('class', 'line-card')
      lineCard.innerHTML = `<h2>${line.name}</h2>`
      lineCard.addEventListener('click', () => {
        requestTicket(line)
      })
      linesElem.appendChild(lineCard)
    }

    dataContainer.appendChild(linesElem)
  }

  // Función que gestiona la solicitud de ticket y presenta los campos a rellenar al usuario
  const requestTicket = (line) => {
    line.getField(false).then((fields) => {
      displayFieldsForUserInput(fields, line)
    })
  }

  // Muestra un formulario con campos que el usuario debe rellenar antes de obtener el ticket
  const displayFieldsForUserInput = (fields, line) => {
    const form = document.createElement('form')

    fields.questions.forEach((question) => {
      const inputWrapper = document.createElement('div')

      const label = document.createElement('label')
      label.innerText = question.question

      const input = document.createElement('input')
      input.setAttribute('type', question.fieldType)
      input.setAttribute('name', question._id)
      input.setAttribute('pattern', question.validCharacter)
      input.setAttribute('title', question.validMessage)
      input.required = question.required

      inputWrapper.appendChild(label)
      inputWrapper.appendChild(input)
      form.appendChild(inputWrapper)
    })

    const submitButton = document.createElement('button')
    submitButton.innerText = 'Obtener Ticket'
    submitButton.addEventListener('click', (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const answers = {}

      fields.questions.forEach((question) => {
        answers[question.question] = formData.get(question._id)
      })

      pickTheTicket(line, answers)
    })

    form.appendChild(submitButton)
    dataContainer.appendChild(form)
  }

  // Función que maneja la lógica de la solicitud de tickets y las respuestas correspondientes
  const pickTheTicket = (line, answers) => {
    line.pickTicket(
      {
        onSuccess(ticket) {
          const ticketInfo = document.createElement('div')
          ticketInfo.innerHTML = `<h2>Success Ticket</h2><pre>${JSON.stringify(
            ticket,
            null,
            2
          )}</pre>`
          dataContainer.appendChild(ticketInfo)
          currentTicketId = ticket.id

          updateLineInfo(line)
          setInterval(() => {
            updateLineInfo(line)
          }, 30000)
        },
        onCall(ticket) {
          const onCallElem = document.createElement('div')
          onCallElem.innerHTML = `<h2>Ticket Being Called</h2><pre>${JSON.stringify(
            ticket,
            null,
            2
          )}</pre>`
          dataContainer.appendChild(onCallElem)

          if (ticket.meetUrl && ticket?.tuid === currentTicketId) {
            generateRedirectButton(ticket.meetUrl)
          }
        },
        onError(error) {
          const errorElem = document.createElement('div')
          errorElem.innerHTML = `<h2>Error</h2><pre>${error.message}</pre>`
          dataContainer.appendChild(errorElem)
        },
      },
      true,
      answers
    )
  }

  // Función que actualiza y muestra información sobre la fila, como las personas en espera y el tiempo promedio de espera
  const updateLineInfo = async (line) => {
    const lineUpdate = await line.lineUpdateInfo()
    const waitingPeople = lineUpdate.waiting
    const avgWaitTime = lineUpdate.raw_tickets.avg_wait.mean

    const lineInfoElem = document.createElement('div')
    lineInfoElem.innerHTML = `<h3>People in queue: ${waitingPeople}</h3><h3>Average wait time: ${avgWaitTime} mins</h3>`
    dataContainer.appendChild(lineInfoElem)
  }

  // Función principal que inicializa el proceso completo
  const init = async () => {
    const zqTemporary = await new ZeroQ.default.newZeroqUserTmp({
      organization: 'zero-q',
    })
    displayLines(zqTemporary)
  }

  // Iniciar el proceso
  init()
}

executeZeroQProcess()
