import { Configuration, OpenAIApi } from 'openai'

const setupInputContainer = document.getElementById('setup-input-container')
const ideaBossText = document.getElementById('idea-boss-text')

// Configureer de openai api, belangrijk hier is de apiKey. Deze is te vinden op https://platform.openai.com/account/api-keys
const configuration = new Configuration({
  apiKey: ""
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
  console.log("Asking the bot to give a quick reply on the topic")
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    // few shot learning
    prompt: `Schrijf een kort bericht waarin je sarcastich uitlegt dat je het een slecht idee vind, maar dat je het alsnog zal gaan onderzoeken. Je geeft aan dat je er even over na gaat denken.
###
Invoer: ${ideevoorstel}
Output: `,
    max_tokens: 200 // Hoe veel tokens de bot mag gebruiken om een antwoord te geven
  })
  ideaBossText.innerText = response.data.choices[0].text.trim()
} 

