document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add('completed');
            }
            li.addEventListener('click', () => {
                toggleTask(index);
            });
            li.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                deleteTask(index);
            });
            taskList.appendChild(li);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask(text) {
        tasks.push({ text, completed: false });
        renderTasks();
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function filterTasks(filter) {
        switch (filter) {
            case 'all':
                allBtn.classList.add('active');
                activeBtn.classList.remove('active');
                completedBtn.classList.remove('active');
                renderTasks();
                break;
            case 'active':
                allBtn.classList.remove('active');
                activeBtn.classList.add('active');
                completedBtn.classList.remove('active');
                const activeTasks = tasks.filter(task => !task.completed);
                taskList.innerHTML = '';
                activeTasks.forEach((task, index) => {
                    const li = document.createElement('li');
                    li.textContent = task.text;
                    li.addEventListener('click', () => {
                        toggleTask(index);
                    });
                    li.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        deleteTask(index);
                    });
                    taskList.appendChild(li);
                });
                break;
            case 'completed':
                allBtn.classList.remove('active');
                activeBtn.classList.remove('active');
                completedBtn.classList.add('active');
                const completedTasks = tasks.filter(task => task.completed);
                taskList.innerHTML = '';
                completedTasks.forEach((task, index) => {
                    const li = document.createElement('li');
                    li.textContent = task.text;
                    li.classList.add('completed');
                    li.addEventListener('click', () => {
                        toggleTask(index);
                    });
                    li.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        deleteTask(index);
                    });
                    taskList.appendChild(li);
                });
                break;
        }
    }

    document.getElementById('allBtn').addEventListener('click', () => {
        filterTasks('all');
    });

    document.getElementById('activeBtn').addEventListener('click', () => {
        filterTasks('active');
    });

    document.getElementById('completedBtn').addEventListener('click', () => {
        filterTasks('completed');
    });

    renderTasks();

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const text = taskInput.value.trim();
            if (text !== '') {
                addTask(text);
                taskInput.value = '';
            }
        }
    });
});
