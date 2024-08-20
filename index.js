// UUID: 5dc8d4d0-7ea0-40d1-90ea-8dfc3b25867b

let user = {
    name,
    to: 'Todos'
}
let messages=  []

let isPrivate  = 'message'


getUser(user)
getParticipants()
setInterval(() => {
    getParticipants()
},10000)
postUser()
getMessages()
updateMessages(messages)
setInterval(() => {
    updateMessages(messages)
},3000)
handleForm()
handleSideMenu()
handlePrivacyButtons()

//GET DOS USUÁRIOS ONLINE
async function getParticipants(){
    try{
        let response = await axios.get('https://mock-api.driven.com.br/api/v6/uol/participants/5dc8d4d0-7ea0-40d1-90ea-8dfc3b25867b')
        let participants = response.data
        const onlineUsers = document.querySelectorAll(".onlineUser")
        for (let user of onlineUsers) {
            user.remove()
        }
        participants.forEach(participant => {
            let listItem = document.createElement('li')
            listItem.classList.add('onlineUser')
            listItem.innerHTML = `<button class = "selectDestination"><img src="assets/person-circle%201.png"> 
                ${participant.name} </button> <ion-icon name="checkmark-outline" class="checkmark">`
            document.querySelector('.usersList').appendChild(listItem)
        })
        handleButton()
    }catch{
        console.log('Error getting participants')
    }
}


//FUNÇÕES DOS BOTÕES DE ESCOLHA DE USUÁRIO
function handleButton(){
    const buttons = document.querySelectorAll(".selectDestination")
    const userList = document.querySelector('.usersList')
    const userListCheckmarks = userList.querySelectorAll('li')
    const textInfo = document.querySelector('.textInfo')
    buttons.forEach(element => {
    element.addEventListener("click",(e) => {
            e.preventDefault()
            user.to = e.target.innerText.trim()
            textInfo.textContent = `Enviando para ${e.target.innerText.trim()}`
            for(let item of userListCheckmarks){
                item.classList.remove('active')
            }
            element.parentElement.classList.add('active')
        })
    })
}

// FUNÇÕES DOS BOTÕES DE ESCOLHA DE PRIVACIDADE
function handlePrivacyButtons(){
    const publicButton = document.querySelector(".isPublic")
    const privateButton = document.querySelector(".isPrivate")

    const publicLi = document.querySelector(".liPublic")
    const privateLi = document.querySelector(".liPrivate")

    publicButton.addEventListener("click",(e) => {
        e.preventDefault()
        isPrivate = 'message'
        publicLi.classList.add('active')
        privateLi.classList.remove('active')
    })
    privateButton.addEventListener("click",(e) => {
        e.preventDefault()
        isPrivate = 'private_message'
        privateLi.classList.add('active')
        publicLi.classList.remove('active')
    })
}

//FUNÇÕES DO MENU LATERAL
function handleSideMenu(){

    const sideButton = document.querySelector(".openMenu")
    const sideMenu = document.querySelector(".sideMenu")
    const sideModal = document.querySelector(".sideModal")

    sideButton.addEventListener('click', ()=>{
        sideMenu.classList.add('sideMenuVisible')
        sideModal.classList.add('sideModalVisible')
    })
    sideMenu.addEventListener('click', ()=>{
        sideMenu.classList.remove('sideMenuVisible')
        sideModal.classList.remove('sideModalVisible')
    })
}


// PEGA O NOME DO USUÁRIO
function getUser(user){
    user.name = prompt("Qual o seu nome?").trim()
}

// POST USUÁRIO
 function postUser(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants/5dc8d4d0-7ea0-40d1-90ea-8dfc3b25867b',{
        name: user.name
    })
    .then(() => {
        setInterval(checkOnline, 5000) // CHECA SE O USUÁRIO ESTÁ ONLINE A CADA 5S
    })
    .catch((error)  => {
        console.log(error)
        getUser(user)
        postUser()
    })
}

// CHECAR SE O USUÁRIO ESTÁ ONLINE

function checkOnline(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status/5dc8d4d0-7ea0-40d1-90ea-8dfc3b25867b',{
        name: user.name
    })
    .catch((err) => {
        console.log(err.message);
    })
}

// PREENCHE O ARRAY DAS MENSAGENS
async function arrayMensagens(){
    const response = await axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/5dc8d4d0-7ea0-40d1-90ea-8dfc3b25867b")
    messages = response.data
    return messages
}


//GET DAS MENSAGENS
async function getMessages(){
    try{
        messages = await arrayMensagens()
        for(let message of messages){
            if(message.to === user.name || message.from === user.name || message.type === 'message'){
                showMessage(message);
            }
        }
    }catch{
        console.log("Error getting messages")
    }
}

//ATUALIZA MENSAGENS E ROLA A PÁGINA
async function updateMessages(){
    try{
        messages = await arrayMensagens()
        let existingMessages = document.querySelectorAll(".messageBody")
        let lastMessage = existingMessages[existingMessages.length - 1].innerText

        for(let message of existingMessages){
            message.remove()
        }
        for(let message of messages){
            if(message.to === user.name || message.from === user.name || message.to === 'Todos'){
                showMessage(message);
            }
        }
        existingMessages = document.querySelectorAll(".messageBody")
        let newLastMessage =  existingMessages[existingMessages.length - 1].innerText
        if(newLastMessage !== lastMessage){
            let lastMsgPosition = existingMessages[existingMessages.length - 1]
            lastMsgPosition.scrollIntoView()
        }
    }catch{
        console.log("Error updating messages")
    }
}

// MOSTRAR MENSAGEM

function showMessage(message){
    const messageBody = document.createElement("div")
    messageBody.classList.add("messageBody")
    let messageText = document.createElement("p")
    if(message.type === 'status'){
        messageText.innerHTML = `<span class = "light" >(${message.time})</span> <span class="bold">${message.from}</span> ${message.text}`
        messageBody.classList.add("statusMessage")
    }else if(message.type === 'message'){
        messageText.innerHTML = `<span class ="light">(${message.time})</span> <span class="bold">${message.from}</span> para <span class = "bold">${message.to}</span>: ${message.text}`
        messageBody.classList.add("publicMessage")
    }else{
        messageText.innerHTML = `<span class="light">(${message.time})</span> <span class="bold">${message.from} </span>reservadamente para <span class="bold">${message.to}</span>: ${message.text}`
        messageBody.classList.add("privateMessage")
    }
    messageBody.appendChild(messageText)
    document.querySelector(".messages").appendChild(messageBody)
}


// POST MENSAGEM

function postMessage(message){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/messages/5dc8d4d0-7ea0-40d1-90ea-8dfc3b25867b',{
        from: message.from,
        to:   message.to,
        text: message.text,
        type: message.type
        })
        .then(() => {
            const messageInput = document.querySelector(".textInput")
            messageInput.value = ''
            updateMessages()
        })
        .catch(()  => {
            window.location.reload()
        })
}

// CUIDA DO FORM

function handleForm(){
    document.querySelector(".messageForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const messageSent = e.target.elements['text'].value
        const message = {
            from: user.name,
            to: user.to,
            text: messageSent,
            type: isPrivate
        }
        postMessage(message)
    })
}
