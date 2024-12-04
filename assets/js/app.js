function collectData() {
    const description = document.getElementById('description').value
    const date = document.getElementById('date').value
    const time = document.getElementById('time').value
    const index = getNumberOfTasksInLocalStorage()
    return {
        index,
        description,
        date,
        time,
    }
}

function generateHTML(data, isNewTask = false) {
    // if new task, add fade in class and delete right after the animation 
    const newHTML = `
        <div class="task ${isNewTask ? 'fadeIn' : ''}" ${isNewTask ? 'onanimationend="this.classList.remove(\'fadeIn\')"' : ''}>
            <div>
                <span class="bi bi-x-circle text-danger" onclick="deleteTask(${data.index})"></span>
            </div>
            <div>${data.description}</div>
            <div>${data.date}<br>${data.time}</div>
        </div>
    `
    return newHTML
}

function renderHTML(newHTML) {
    const tasksContainer = document.getElementById('tasks')
    tasksContainer.innerHTML += newHTML
}

function clearForm() {
    const tasksForm = document.getElementById('tasksForm')
    tasksForm.reset()

    const descriptionInput = document.getElementById('description')
    descriptionInput.focus()
}

function saveSingleTaskToStorage(taskObject) {
    const currentTasksInStorageJSON = localStorage.getItem('tasks')
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON)
    currentTasksInStorage.push(taskObject)
    localStorage.setItem('tasks', JSON.stringify(currentTasksInStorage))
}

function loadTasksFromLocalStorage() {
    // load the tasks from the local storage,
    // arrange them by index order and saves them back in the right order
    const tasksJSON = localStorage.getItem('tasks')
    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON)
        const validTasks = [] // new array for the tasks that still not expired
        for (const task of tasks) {
            //check if the task is not expired
            if (!isTaskExpired(task)) {
                task.index = validTasks.length //change the index to new updated index (mostly after deleting one of the notes)
                const newHTML = generateHTML(task) // saves to newHTML the existing tasks with updated index
                renderHTML(newHTML) // render the taskContainer with the new index
                validTasks.push(task)
            }
        }
        localStorage.setItem('tasks', JSON.stringify(validTasks))
    }
}

function isTaskExpired(task) {
    const now = new Date();
    const taskDateTime = new Date(task.date + 'T' + task.time);
    return taskDateTime <= now;
}

function deleteAllCurrentTasks() {
    // Clear the tasks from the DOM
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';
}

function initStorage() {
    // set the local storage to [] if empty
    const currentTasksInStorageJSON = localStorage.getItem('tasks')
    if (!currentTasksInStorageJSON) {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
}

function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')).length
}

function addTask(event) {
    event.preventDefault()
    const data = collectData()
    const newHTML = generateHTML(data, true)
    renderHTML(newHTML)
    saveSingleTaskToStorage(data) // saves single task to storage
    clearForm() //clears the form after adding task
}

function deleteTask(index) {
    // delete a task, then reupload all existing tasks 
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    const tasksArray = []
    for (const task of tasks) {
        if (task.index !== index) tasksArray.push(task)
    }
    localStorage.setItem('tasks', JSON.stringify(tasksArray))
    deleteAllCurrentTasks()
    loadTasksFromLocalStorage()
}

initStorage()
loadTasksFromLocalStorage()