import { topBar } from "../views/main";

initLS();
// localStorage.setItem('theme', 0);

const currentTheme = localStorage.getItem('theme');
console.log('Проверка');
currentTheme 
  ? document.body.dataset.theme = currentTheme
  : document.body.dataset.theme = 'light'

// (() => {
//   const currentTheme = localStorage.getItem('theme');
//   console.log('Проверка');
//   currentTheme 
//     ? document.body.dataset.theme = currentTheme
//     : document.body.dataset.theme = 'light'
// })();

if (checkPage('supporttickets.php')){
  updateTicketsView();
}

// Ссылки на очереди

let toAwaitBtn = document.createElement('button');
toAwaitBtn.innerHTML = "Эвейт";
let toProgressBtn = document.createElement('button');
toProgressBtn.innerHTML = "Прогресс";
let toolbarLinksWrapper = document.createElement('div');
toolbarLinksWrapper.classList.add('toolbar__links-wrapper');
toAwaitBtn.classList.add('toolbar__button-await');
toProgressBtn.classList.add('toolbar__button-progress');
toolbarLinksWrapper.appendChild(toAwaitBtn);
toolbarLinksWrapper.appendChild(toProgressBtn);

// Нижний тулбар

let toolbar = document.createElement('div');
toolbar.classList.add('toolbar');
document.querySelector('body').appendChild(toolbar);

let clearAllTickets = document.createElement('a');
clearAllTickets.innerHTML = "Дополнительно"

clearAllTickets.addEventListener('click', f => {
  let test = document.createElement('a');
  test.innerHTML = "Удалить все метки";
  showModal('Дополнительно', test);
});

let myTicketsObj = JSON.parse(localStorage.tickets);

toAwaitBtn.addEventListener('click', f =>{
  window.open('supporttickets.php', '_self');
});

toProgressBtn.addEventListener('click', f =>{
  window.open('supporttickets.php?view=In%20Progress', '_self');
});

toolbar.appendChild(toolbarLinksWrapper);
toolbar.appendChild(clearAllTickets);

// Получаем форму ответа (только на странице с GET=action)
if (
  findGetParameter('action') !=null & 
  findGetParameter('action') == 'view' || 
  findGetParameter('action') == 'viewticket'
){
  // Номер заявки
  let ticketNum = document.querySelector('input[name=ticketnum]').value;
  
  // Форма ответа с submit
  let form = document.querySelector('.fieldarea');
  
  // Создаем кнопки для добавления тикета в список отметок
  let tagTogglerElem = document.createElement('div');
  let addTicketBtn = document.createElement('a');
  let deleteTicketBtn = document.createElement('a');

  const postReplyButton = document.querySelector('#postreplybutton');
  
  postReplyButton.addEventListener('click', e => {
    addTicketLs(findGetParameter('id'), ticketNum);
  });
  
  if (checkTicketNum(ticketNum)){
    addTicketBtn.classList.toggle('toggler-tag__tab_active');
  }else{
    deleteTicketBtn.classList.toggle('toggler-tag__tab_active');
  }
  
  tagTogglerElem.classList.add('toggler-tag');
  
  addTicketBtn.innerHTML = 'Выделять в списке'; 
  addTicketBtn.classList.add('toggler-tag__tab');
  
  deleteTicketBtn.innerHTML = "Не выделять";
  deleteTicketBtn.classList.add('toggler-tag__tab');
  
  // Оборачиваем кнопки в div toggler-tag
  tagTogglerElem.appendChild(addTicketBtn);
  tagTogglerElem.appendChild(deleteTicketBtn);
  
  // Кнока удаления
  deleteTicketBtn.addEventListener('click', elem=>{
    if(removeTicketLs(findGetParameter('id'))){
      showAlert('success', 'Тикет удален!');
      setToggler(elem.target);
    }else{
      showAlert('error', 'Что-то пошло не так');
    }
  });
  
  // Кнока добавления
  addTicketBtn.addEventListener('click', elem => {
    if(addTicketLs(findGetParameter('id'), ticketNum)){
      showAlert('success', 'Тикет добавлен!');
      setToggler(elem.target);
    }else{
      showAlert('warning', 'Тикет уже добавлен!');
    }
  });
  
  // Добавляем тоглер на страницу
  form.appendChild(tagTogglerElem);
  
  function setToggler(elem){
    tagTogglerElem.querySelectorAll('a').forEach(item => {
      item.classList.remove('toggler-tag__tab_active');
    });
    elem.classList.add('toggler-tag__tab_active');
  }

}


function checkPage(page){
  let isClientSerice = location.pathname.split('/');
  let result = false;
  isClientSerice.forEach(item=>{
    if (item == page){
      result = true;
    }
  });
  return result;
}

// Метод обновления меток

function updateTicketsView(){
  // Получаем список тикетов
  const tablebg = document.querySelector('.tablebg');
  const ticketsList = tablebg.querySelectorAll('tr');
  
  // Выделяем тикеты в списке
  ticketsList.forEach((item, num) => {
    if(num !=0){
      let itemTitle = item.querySelectorAll('td')[3].querySelector('a');
      let itemTitleCurrent = item.querySelectorAll('td')[3].querySelector('a').innerHTML;
      let nums = itemTitleCurrent.substr(1).split('-')[0].trim();
      if (checkTicketNum(nums)){
        itemTitle.classList.toggle('my-ticket');
      }
    }
  });
}

// Метод получения значения GET параметра
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

// Метод добавления тикета в LS
function addTicketLs(id, num){
  let jsonObj = JSON.parse(localStorage.tickets);
  let result = false;

  if(!checkTicketNum(num)){
    if(jsonObj.myTickets.length != 0){
      jsonObj.myTickets.push(
        {"id": id, "num": num}
      );
      localStorage.setItem('tickets', JSON.stringify(jsonObj));
      result = true;
    }else{
      jsonObj.myTickets.push(
        {"id": id, "num": num}
      );
      localStorage.setItem('tickets', JSON.stringify(jsonObj));
      result = true;
    }
  }
  
  return result;
}

// Метод удаления тикета из LS
function removeTicketLs(id){
  let myTicketsObj = JSON.parse(localStorage.tickets);
  let result = false;
  myTicketsObj.myTickets.forEach((item, num) =>{
    if(item.id == id) {
      myTicketsObj.myTickets.splice(num, 1);
      setNewLS('tickets', myTicketsObj);
      result = true;
    }
  });
  return result;
}

// Метод проверки наличия тикета в LS
function checkTicketNum(num) {
  let jsonObj = JSON.parse(localStorage.tickets);
  let result = false;
  
  jsonObj.myTickets.forEach(e => {
    if (e.num == num) {
      result = true;
    }
  });
  
  return result;
}

// Метод инициализации хранилища
function initLS(){
  if (!localStorage.getItem('tickets')){
    const myTickets = {
      "myTickets": []
    };
    localStorage.setItem(
      'tickets', 
      JSON.stringify(myTickets)
    )
  };
}

// Метод добавления обновленного значения item в LS
function setNewLS(item, jsonObj){
  localStorage.removeItem('tickets'); 
  localStorage.setItem(item, JSON.stringify(jsonObj));
}


// Уведомления

function showAlert(type, message){
  
  let alerCSSClass;
  
  switch (type) {
    case 'error':
      alerCSSClass = 'tagger-alert_error';
      break;
    case 'warning':
      alerCSSClass = 'tagger-alert_warning';
      break;
    case 'success':
      alerCSSClass = 'tagger-alert_success';
      break;
  }
  
  let alertElem = document.createElement('div');
  alertElem.classList.add('tagger-alert', alerCSSClass);
  alertElem.innerHTML = message;
  document.querySelector('body').appendChild(alertElem);
  setTimeout(function(){
    alertElem.classList.toggle('tagger-alert_active');
  });
  setTimeout(function() {
    alertElem.classList.toggle('tagger-alert_active');
  }, 1700);
  setTimeout(function(){
    alertElem.remove();
  },3000);
}


// Расширение для карточки услуги

if(checkPage('clientsservices.php')){
  
  let panels = {
    available: {
      "ISP Manager": '',
      "ISP5 Manager": '',
      "ISP6 Manager": '',
      "DirectAdmin": '',
      "VestaCP": '',
      "aaPanel": '',
      "HestiaCP": '',
      "FastPanel": ''
    },
    
    getAuthLink: function(){
      const serviceDescription = document.querySelector('textarea[name=assignedips]').innerHTML;
      const regEx = /(http|https):\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[1-9][0-9]{3}/gm;
      const result = serviceDescription.match(regEx);
      return result;
    },
    
    isp: {
      auth: function(ip, pass){
        let link = `https://${ip}:1500/ispmgr?func=auth&username=root&password=${pass}`;
        return link;
      }
    },
    checkPanel: function(){
      const serviceDescription = document.querySelector('textarea[name=assignedips]').innerHTML;
      
      let result = false;
      
      const panelsKeys = Object.keys(this.available);
      panelsKeys.forEach((elem, i) => {
        if (serviceDescription.search(elem) != -1){
          result = elem;
        }
      });
      return result;
    }
  }

  const ipAddress = document.querySelector('input[name=dedicatedip]').value;
  const password = document.querySelector('input[name=password]').value;
  const serviceDescription = document.querySelector('textarea[name=assignedips]');
  let linksWrapper = document.createElement('div');
  linksWrapper.classList.add('contentarea__links');
  const titlePageElem = document.querySelector('h1');
  titlePageElem.after(linksWrapper);
  // toolbar.appendChild(linksWrapper);
  const panel = panels.checkPanel();
  
  // Проверка панели
  if (panel !== false) {
    let panelLinkElem = document.createElement('button');
    linksWrapper.appendChild(panelLinkElem);
    panelLinkElem.classList.add('panel-link');
    panelLinkElem.innerHTML = `Перейти в ${panel}`;
    
    panelLinkElem.addEventListener('click', elem =>{
      if(panel != 'ISP Manager' & panel != 'ISP5 Manager' != 'ISP6 Manager'){
        window.open(panels.getAuthLink());
      }else{
        window.open(panels.isp.auth(ipAddress, password));
      }

    });
  }
  
  let copyRootBtn = document.createElement('button');
  copyRootBtn.innerHTML = "root";
  let copyIpBtn = document.createElement('button');
  copyIpBtn.innerHTML = ipAddress;
  let copyPanelPassBtn = document.createElement('button');
  copyPanelPassBtn.innerHTML = "Пароль панели";
  let sshTextBtn = document.createElement('button');
  sshTextBtn.innerHTML = `g ${ipAddress} --user root`;
  let textCopyElem = document.createElement('span');
  textCopyElem.innerHTML = "Скопировать: ";
  linksWrapper.appendChild(textCopyElem);
  linksWrapper.appendChild(copyIpBtn);
  linksWrapper.appendChild(copyRootBtn);
  linksWrapper.appendChild(copyPanelPassBtn);
  linksWrapper.appendChild(sshTextBtn);
  
  if(panel == 'VestaCP' || panel == 'HestiaCP' || panel == 'DirectAdmin'){
    console.log(getPanelPass());
  }
  
  copyIpBtn.addEventListener('click', item =>{
    copyStringToClipboard(ipAddress);
    showAlert('success', 'ip скопирован!');
  });
  
  copyRootBtn.addEventListener('click', item =>{
    copyStringToClipboard(password);
    showAlert('success', 'Пароль root скопирован!');
  });
  
  sshTextBtn.addEventListener('click', item =>{
    copyStringToClipboard(`g ${ipAddress} --user root`);
    showAlert('success', `g ${ipAddress} --user root скопирован!`);
  });
  
  copyPanelPassBtn.addEventListener('click', item =>{
    copyStringToClipboard(getPanelPass());
    showAlert('success', `Пароль скопирован!`);
  });
  
  function getPanelPass(){
    let testStr = serviceDescription.innerHTML;
    const adminIndex = testStr.search(/admin/);
    let passStr = testStr.substr(adminIndex);
    passStr = passStr.replace(/ /g,'').split('/');
    return passStr[1];
  }
  
  function copyStringToClipboard (str) {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  
  let textarea = document.querySelector('textarea[name=assignedips]');
  textarea.css
  
}

function showModal(title, bodyElem){
  let modal = document.createElement('div');
  const overlay = document.createElement('div');
  const header = document.createElement('h1');
  const body = document.createElement('div');
  
  header.innerHTML = title;
  overlay.classList.add('overlay');
  modal.classList.add('modal');
  body.classList.add('modal__body');
  
  document.querySelector('body').appendChild(modal);
  modal.appendChild(header);
  modal.appendChild(body);
  body.appendChild(bodyElem);
  document.querySelector('body').appendChild(overlay);
  
  overlay.addEventListener('click', f => {
    overlay.remove();
    modal.remove();
  });
  
}

// true - темная, false - светлая 
const changeTheme = () => {
  const currentTheme = localStorage.getItem('theme');
  const { dataset } = document.body;
  if (currentTheme !== null) {
    console.log(currentTheme);
    if (currentTheme === 'light') {
      dataset.theme = 'dark'
      localStorage.setItem('theme', 'dark');
    }else {
      dataset.theme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }else {
    // localStorage.setItem('theme', false)
  }
}

const topBarLeft = topBar.querySelector('.left');
const changeThemeBtn = document.createElement('a');
changeThemeBtn.innerHTML = 'Сменить тему';
changeThemeBtn.classList.add('changeTheme');
changeThemeBtn.addEventListener('click', changeTheme);
topBarLeft.innerHTML += ' | ';
topBarLeft.appendChild(changeThemeBtn);
