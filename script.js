// script.js

// Variáveis globais para armazenamento de dados
let metas = [];
let dates = [];
let conquistas = [];
let diario = [];

// Navegação entre seções
const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        showSection(targetId);
        // Marcar o link como ativo
        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
    });
});

function showSection(id) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === id) {
            section.classList.add('active');
        }
    });
}

// Exibir a seção inicial
showSection('home');

// Funções para adicionar e exibir Metas (To-Do List)
function showAddMetaModal() {
    document.getElementById('addMetaModal').style.display = 'block';
}

function addMeta() {
    const metaName = document.getElementById('metaName').value;
    if (metaName) {
        metas.push({ name: metaName, status: 'Ativa' });
        document.getElementById('metaName').value = '';
        closeModal('addMetaModal');
        renderMetas();
    }
}

function renderMetas() {
    const metasList = document.getElementById('metas-list');
    const fullMetasList = document.getElementById('full-metas-list');
    metasList.innerHTML = '';
    fullMetasList.innerHTML = '';
    metas.forEach((meta, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" ${meta.status === 'Concluída' ? 'checked' : ''} onclick="toggleMetaStatus(${index})"> ${meta.name} <span class="status ${meta.status}">${meta.status}</span>`;
        metasList.appendChild(li.cloneNode(true));
        fullMetasList.appendChild(li.cloneNode(true));
    });
}

function toggleMetaStatus(index) {
    metas[index].status = metas[index].status === 'Ativa' ? 'Concluída' : 'Ativa';
    renderMetas();
}

// Funções para adicionar e exibir Dates com detalhes adicionais
function showAddDateModal() {
    document.getElementById('addDateModal').style.display = 'block';
}

function addDate() {
    const dateTitle = document.getElementById('dateTitle').value;
    const dateLocation = document.getElementById('dateLocation').value;
    const dateDate = document.getElementById('dateDate').value;
    if (dateTitle && dateDate) {
        dates.push({ title: dateTitle, location: dateLocation, date: dateDate });
        document.getElementById('dateTitle').value = '';
        document.getElementById('dateLocation').value = '';
        document.getElementById('dateDate').value = '';
        closeModal('addDateModal');
        renderDates();
        renderCalendar();
    }
}

function renderDates() {
    const datesList = document.getElementById('dates-list');
    datesList.innerHTML = '';
    dates.forEach((date) => {
        const li = document.createElement('li');
        li.innerHTML = `${date.date} - ${date.title} @ ${date.location}`;
        datesList.appendChild(li);
    });
}

// Funções para adicionar e exibir Conquistas
function showAddConquistaModal() {
    document.getElementById('addConquistaModal').style.display = 'block';
}

function addConquista() {
    const conquistaName = document.getElementById('conquistaName').value;
    if (conquistaName) {
        conquistas.push({ name: conquistaName });
        document.getElementById('conquistaName').value = '';
        closeModal('addConquistaModal');
        renderConquistas();
    }
}

function renderConquistas() {
    const conquistasList = document.getElementById('conquistas-list');
    conquistasList.innerHTML = '';
    conquistas.forEach((conquista) => {
        const li = document.createElement('li');
        li.innerHTML = `${conquista.name}`;
        conquistasList.appendChild(li);
    });
}

// Funções para adicionar e exibir Diário com arquivos
function showAddDiarioModal() {
    document.getElementById('addDiarioModal').style.display = 'block';
}

function addDiario() {
    const diarioTitle = document.getElementById('diarioTitle').value;
    const diarioContent = document.getElementById('diarioContent').value;
    const diarioFileInput = document.getElementById('diarioFile');
    const diarioFiles = Array.from(diarioFileInput.files);

    if (diarioTitle && diarioContent) {
        diario.push({ title: diarioTitle, content: diarioContent, files: diarioFiles });
        document.getElementById('diarioTitle').value = '';
        document.getElementById('diarioContent').value = '';
        document.getElementById('diarioFile').value = '';
        closeModal('addDiarioModal');
        renderDiario();
    }
}

function renderDiario() {
    const diarioList = document.getElementById('diario-list');
    diarioList.innerHTML = '';
    diario.forEach((entry) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${entry.title}</strong>: ${entry.content}`;

        if (entry.files.length > 0) {
            const fileList = document.createElement('ul');
            entry.files.forEach((file) => {
                const fileItem = document.createElement('li');
                fileItem.textContent = file.name;
                fileList.appendChild(fileItem);
            });
            li.appendChild(fileList);
        }

        diarioList.appendChild(li);
    });
}

// Fechar Modais
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funções para o Calendário
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar() {
    const calendarTable = document.getElementById('calendar-table');
    calendarTable.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    let date = 1;

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                row.appendChild(cell);
            } else if (date > lastDate) {
                break;
            } else {
                cell.innerHTML = date;
                const currentDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

                // Verificar se é "Nosso Dia"
                if (date === 20) {
                    cell.classList.add('event-day');
                    cell.innerHTML += "<br><small>Nosso Dia</small>";
                }

                // Verificar se há um evento neste dia
                if (dates.some(dateObj => dateObj.date === currentDateStr)) {
                    cell.classList.add('event-day');
                }

                row.appendChild(cell);
                date++;
            }
        }
        calendarTable.appendChild(row);
    }
    document.getElementById('month-year').innerText = `${getMonthName(currentMonth)} ${currentYear}`;
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function getMonthName(monthIndex) {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return monthNames[monthIndex];
}

// Inicializar o calendário
renderCalendar();
