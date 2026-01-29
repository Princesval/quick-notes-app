let notes = [] // Array que salva as notas
let editingNoteId = null // Variável que auxilia encontrar a nota exata quer vai ser editada
let currentFilter = 'all' // Variável para o filtro

function toggleFilterMenu() {
    document.getElementById('filterMenu').classList.toggle('active') // Função para abrir e fechar o menu de filtro
}

function setFilter(filter) {
    currentFilter = filter
    renderNotes()
    document.getElementById('filterMenu').classList.remove('active')
}



function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
    // Verifica se há notas e ascarrega usando o localStorege e transforma elas de String para array
}

function saveNote(event) {
    event.preventDefault() // Evita no formulário dar um refresh na página

    const title = document.getElementById('noteTitle').value.trim(); // Pega o valor do título da nota
    const content = document.getElementById('noteContent').value.trim(); // Pega o valor do texto da nota

    if(editingNoteId) {
        // Update nota
        const noteIndex = notes.findIndex(note => note.id === editingNoteId) // Acha a posição da nota dentro do array
        notes[noteIndex] = {
            ...notes[noteIndex], // Spread... para manter o contúdo o mesmo
            title: title, // Substitui pelo novo título
            content: content // Substitui pelo novo texto
        }
    } else {
        // Unshift adciona um valor no começo de um array
        notes.unshift({
            id: generateId(),
            title: title,
            content: content,
            completed: false
            // Cada nota é um objeto com 3 propriedades: id, title, content e completed 
        })
    }

    closeNoteDialog() // Fecha o Dialog
    saveNotes() // Salva a nota no localStorage como uma String
    renderNotes() // Faz as notas aparecerem no site
}

function toggleNoteStatus(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId)
    notes[noteIndex].completed = !notes[noteIndex].completed // troca entre true e false
    saveNotes()
    renderNotes()
}

function generateId() {
    return Date.now().toString() // Usa  data como um id para as notas
}

function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes))
    // Salva o array como um String no localStorage. Usando a função do JSON para transformar o array em String
}

function deleteNote(noteId) {
    // Filtra o array para manter apenas as notas que não possuen o Id passado na função, função essa que é chamada no renderNotes
    notes = notes.filter(note => note.id != noteId)
    saveNotes() // Salva as notas
    renderNotes() // Carrega notos retirando a nota que foi excluída
}

function renderNotes() { // Cria  e mostra as notas
    const notesContainer = document.getElementById('notesContainer');
    let filteredNotes = notes

    if (currentFilter === 'pending') {
        filteredNotes = notes.filter(note => !note.completed)
    }

    if (currentFilter === 'completed') {
        filteredNotes = notes.filter(note => note.completed)
    }

    if(filteredNotes.length === 0) {
        // Se não há notas criadas, mostra uma mensagem incentivando a criar a primeira nota
        notesContainer.innerHTML = `
            <div class="empty-state"> 
                <h2>No notes yet</h2>
                <p>
                    ${currentFilter === 'all'? 'Create your first note to get started!': 'No notes match this filter.'}
                </p>
                <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
            </div>
        `
        return
    } 
    // Map vai retornar um array de Strings que contém o HTML de cada nota
    notesContainer.innerHTML = filteredNotes.map(note => `
        <div class="note-card ${note.completed ? 'completed' : ''}">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-actions">
                <button class="status-btn ${note.completed ? 'completed' : 'pending'}" onclick="toggleNoteStatus('${note.id}')" title="${note.completed ? 'Mark as pending' : 'Mark as completed'}">
                ${note.completed 
                ? `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/>
                </svg>
                `
                : `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/>
                </svg>
                `
                }
                </button>

                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                </svg>
                </button>
                
            </div>
      </div>
        `).join('') // Transforma o array the Strings em uma só String
}

function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    if(noteId) {
        // Edit Mode
        const noteToEdit = notes.find(note => note.id === noteId) // Acha a nota que foi passada no parâmentro
        editingNoteId = noteId // Transforma a váriavel nesse ID
        document.getElementById('dialogTitle').textContent = 'Edit Note'
        titleInput.value = noteToEdit.title // Edita o título
        contentInput.value = noteToEdit.content // Edita o texto
    }
    else {
        // Add Mode
        editingNoteId = null
        document.getElementById('dialogTitle').textContent = 'Add New Note'
        titleInput.value = ''
        contentInput.value = ''
    }

    dialog.showModal() // Função que abre o Dialog
    titleInput.focus() // Deixa o fundo borrado

}

function closeNoteDialog() {
    document.getElementById('noteDialog').close()  // Função que fecha o Dialog
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme')
        document.getElementById('themeToggleBtn').textContent = '☀️'
    }
}

document.addEventListener('DOMContentLoaded', function() { // Lugar onde os eventlisteners ficarão
    applyStoredTheme() // Aplica o modo claro ou escuro quando a página carrega
    notes = loadNotes() // Carregar as notas do localStorage
    renderNotes() // Mostra as notas quando a página carrega

    document.getElementById('filterToggleBtn').addEventListener('click', toggleFilterMenu)
    document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.filter-dropdown')
    if (dropdown && !dropdown.contains(event.target)) {
        document.getElementById('filterMenu').classList.remove('active')
    }
    })
    document.getElementById('noteForm').addEventListener('submit', saveNote)
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if(event.target === this) {
            closeNoteDialog()
            // A palavra "this" se refere ao documento então quando se clicar em qualquer lugar no documento fecha a nota
        }
    })
})