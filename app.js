let notes = [] // Array que salva as notas
let editingNoteId = null // Variável que auxilia encontrar a nota exata quer vai ser editada

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
            content: content
            // Cada nota é um objeto com 3 propriedades: id, title e content
        })
    }

    closeNoteDialog() // Fecha o Dialog
    saveNotes() // Salva a nota no localStorage como uma String
    renderNotes() // Faz as notas aparecerem no site
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

    if(notes.length === 0) {
        // Se não há notas criadas, mostra uma mensagem incentivando a criar a primeira nota
        notesContainer.innerHTML = `
            <div class="empty-state"> 
                <h2>No notes yet</h2>
                <p>Create your first note to get started!</p>
                <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
            </div>
        `
        return
    } 
    // Map vai retornar um array de Strings que contém o HTML de cada nota
    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-actions">
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
    localStorage.setItem('theme', isDark ? 'dark' : 'ligh')
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

    document.getElementById('noteForm').addEventListener('submit', saveNote)
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if(event.target === this) {
            closeNoteDialog()
            // A palavra "this" se refere ao documento então quando se clicar em qualquer lugar no documento fecha a nota
        }
    })
})