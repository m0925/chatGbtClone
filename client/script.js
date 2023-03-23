import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatcontainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent +='.';
    if(element.textContent ==='...'){
      element.textContent='';
    }
  }, 300)
}

function typeText(element, text){
  let index = 0;
  let interval = setInterval(() =>{
    if(index < text.length){
      element.innerHTML += text.charAt(index)
      index++;

    } else{
      clearInterval(interval);
    }
  }, 20)

}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;

}

function chatStripe(isAi, value, uniqueId){
  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          
          <div class="message" id="${uniqueId}">${value}</div>

        </div>
    </div>

    
    `
  )
}

const handleSubmit = async (e)=>{
  e.preventDefault();
  const data = new FormData(form)


// user's chatstripe
chatcontainer.innerHTML += chatStripe(false, data.get('prompt'));
form.reset();

// bot's chartstripe

const uniqueId = generateUniqueId();

chatcontainer.innerHTML += chatStripe(true, " ", uniqueId);
form.reset();

chatcontainer.scrollTop = chatcontainer.scrollHeight;

const messageDiv = document.getElementById(uniqueId);
loader(messageDiv);

 // fetch data from server -> bot's response

 const response = await fetch('https://chatgbtclone.onrender.com/', {
  method: 'POST' ,
  headers:{
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
 } )
clearInterval(loadInterval);
messageDiv.innerHTML = '';
if (response.ok){
  const data = await response.json();
  const parsedData = data.bot.trim();
  console.log({parsedData});

  typeText(messageDiv, parsedData)
}else {
  const err = await response.text();
  messageDiv.innerHTML= "Something went wrong"
}

}

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) =>{
  if(e.keyCode ===13){
    handleSubmit(e);
  }             
}) ;
