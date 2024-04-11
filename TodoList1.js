document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(function(task, index) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn">Eliminar</button>
            `;
            li.dataset.index = index;
            taskList.appendChild(li);
        });
        updateTaskCount();
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
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
            saveTasks();
        }
    });

    allBtn.addEventListener('click', function() {
        allBtn.classList.add('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.remove('active');
        renderTasks();
    });

    activeBtn.addEventListener('click', function() {
        allBtn.classList.remove('active');
        activeBtn.classList.add('active');
        completedBtn.classList.remove('active');
        const activeTasks = tasks.filter(task => !task.completed);
        taskList.innerHTML = '';
        activeTasks.forEach(function(task, index) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">Eliminar</button>
            `;
            li.dataset.index = tasks.indexOf(task);
            taskList.appendChild(li);
        });
    });

    completedBtn.addEventListener('click', function() {
        allBtn.classList.remove('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.add('active');
        const completedTasks = tasks.filter(task => task.completed);
        taskList.innerHTML = '';
        completedTasks.forEach(function(task, index) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text completed">${task.text}</span>
                <button class="delete-btn">Eliminar</button>
            `;
            li.dataset.index = tasks.indexOf(task);
            taskList.appendChild(li);
        });
    });

    clearCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        saveTasks();
    });

    loadTasks();
});
