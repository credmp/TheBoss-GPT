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
    fetchBusinessIdea(userInput)
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

async function fetchBusinessIdea(ideevoorstel) {
  console.log("De bot gaat een voorstel schrijven");
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    // few shot learning
    prompt: `Beschrijf in een uitgebreid voorstel hoe we geld kunnen gaan verdienen aan dit idee. Bedenkt ook een pakkende bedrijfsnaam die je in het voorstel verwerkt. Je geeft daarbij ook aan hoe je denkt. Schrijf het voorstel als een persbericht.
###
Invoer: ${ideevoorstel}
Output: `,
    max_tokens: 700 // Hoe veel tokens de bot mag gebruiken om een antwoord te geven
  })
  const voorstel = response.data.choices[0].text.trim();
  document.getElementById('output-text').innerText = voorstel;

  fetchTitle(voorstel);
}

async function fetchTitle(voorstel) {
  console.log("De bot gaat een title schrijven");
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    // few shot learning
    prompt: `Uit het voorstel haal je de titel van het persbericht.
###
Invoer: ${voorstel}
Output: `,
    max_tokens: 100 // Hoe veel tokens de bot mag gebruiken om een antwoord te geven
  })
  const titel = response.data.choices[0].text.trim();
  console.log(titel);
  document.getElementById('output-title').innerText = titel;
  fetchImagePromt(titel, voorstel);
}

async function fetchImagePromt(titel, voorstel){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Geef een korte omschrijving van een plaatje wat voor advertentie gebruikt kan worden. Het plaatje moet passen bij de titel en het voorstel.
    ###
    titel: ${titel}
    voorstel: ${voorstel}
    image description:
    `,
    temperature: 0.8,
    max_tokens: 100
  })
  fetchImageUrl(response.data.choices[0].text.trim())
}

async function fetchImageUrl(imagePrompt){
  const response = await openai.createImage({
    prompt: `${imagePrompt}. Zet geen tekst in het plaatje.`,
    n: 1,
    size: '256x256',
    response_format: 'b64_json'
  })
  document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${response.data.data[0].b64_json}">`
  setupInputContainer.innerHTML = `Hier is het voorstel...`
  ideaBossText.innerText = `Wat een ontzettend goed idee was dit toch, ik zal nooit meer aan je twijfelen als ik maar 50% krijg 💰`
}
