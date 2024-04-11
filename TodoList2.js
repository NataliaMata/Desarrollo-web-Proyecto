document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = [];

    function renderTasks(filter = 'all') {
        const filteredTasks = filterTasks(tasks, filter);
        taskList.innerHTML = '';
        filteredTasks.forEach(function(task, index) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text ${task.completed ? 'completed' : ''}" contenteditable>${task.text}</span>
                <button class="delete-btn">Eliminar</button>
            `;
            li.dataset.index = index;
            taskList.appendChild(li);
        });
        updateTaskCount();
    }

    function filterTasks(tasks, filter) {
        if (filter === 'all') {
            return tasks;
        } else if (filter === 'active') {
            return tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            return tasks.filter(task => task.completed);
        }
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} tarea${activeTasks !== 1 ? 's' : ''}`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && taskInput.value.trim() !== '') {
            tasks.push({ text: taskInput.value.trim(), completed: false });
            renderTasks();
            saveTasks();
            taskInput.value = '';
        }
    });

    taskList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const index = event.target.parentNode.dataset.index;
            tasks.splice(index, 1);
            renderTasks();
            saveTasks();
        } else if (event.target.classList.contains('task-text')) {
            const index = event.target.parentNode.dataset.index;
            tasks[index].text = event.target.textContent;
            saveTasks();
        }
    });

    allBtn.addEventListener('click', function() {
        allBtn.classList.add('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.remove('active');
        renderTasks('all');
    });

    activeBtn.addEventListener('click', function() {
        allBtn.classList.remove('active');
        activeBtn.classList.add('active');
        completedBtn.classList.remove('active');
        renderTasks('active');
    });

    completedBtn.addEventListener('click', function() {
        allBtn.classList.remove('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.add('active');
        renderTasks('completed');
    });

    clearCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        saveTasks();
    });

    loadTasks();
});
