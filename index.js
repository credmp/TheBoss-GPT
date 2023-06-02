import { Configuration, OpenAIApi } from 'openai'

const setupInputContainer = document.getElementById('setup-input-container')
const ideaBossText = document.getElementById('idea-boss-text')

// Configureer de openai api, belangrijk hier is de apiKey. Deze is te vinden op https://platform.openai.com/account/api-keys
const configuration = new Configuration({
  apiKey: "HIER DE API KEY"
})

const openai = new OpenAIApi(configuration)

/*
 * Get the user input and send it to the bot. Calls the fetchBotReply function and should build a synopsis based on the bot reply.
 *
 * @param {string} userInput - The user input
 * @returns {void}
 */
document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById('setup-textarea')
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    ideaBossText.innerText = `Ok, laat ik dat eens aan de binnenkant van mijn oogjes bekijken.`
    fetchBotReply(userInput)
    //fetchBusinessPlan(userInput)
  }
})

async function fetchBotReply(ideevoorstel) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    // few shot learning
    prompt: `HIER DE PROMPT`,
    max_tokens: 150 // Hoe veel tokens de bot mag gebruiken om een antwoord te geven
  })
  ideaBossText.innerText = response.data.choices[0].text.trim()
} 

