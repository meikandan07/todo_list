let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Add Task
function addTask() {

    const taskInput = document.getElementById("taskInput");

    const priority = document.getElementById("priority");

    const dueDate = document.getElementById("dueDate");

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task!");

        return;
    }

    const task = {

        id: Date.now(),

        text: text,

        priority: priority.value,

        dueDate: dueDate.value,

        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    dueDate.value = "";

    displayTasks();
}


// Display Tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    taskList.innerHTML = "";


    let filteredTasks = tasks.filter(task => {

        // Search
        const matchesSearch =
            task.text.toLowerCase().includes(searchText);


        // Filter
        let matchesFilter = true;

        if (currentFilter === "active") {

            matchesFilter = !task.completed;

        }

        if (currentFilter === "completed") {

            matchesFilter = task.completed;

        }

        return matchesSearch && matchesFilter;

    });


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task ${task.priority}`;


        const info = document.createElement("div");

        info.className = "task-info";


        const title = document.createElement("div");

        title.className = "task-title";

        title.textContent = task.text;


        if (task.completed) {

            title.classList.add("completed");

        }


        const meta = document.createElement("div");

        meta.className = "task-meta";

        meta.textContent =
            `Priority: ${task.priority.toUpperCase()}`
            + (task.dueDate
                ? ` | Due: ${task.dueDate}`
                : "");


        info.appendChild(title);

        info.appendChild(meta);


        // Buttons

        const buttons = document.createElement("div");

        buttons.className = "task-buttons";


        const completeBtn =
            document.createElement("button");

        completeBtn.className = "complete-btn";

        completeBtn.textContent =
            task.completed ? "Undo" : "Done";

        completeBtn.onclick = () =>
            toggleTask(task.id);


        const editBtn =
            document.createElement("button");

        editBtn.className = "edit-btn";

        editBtn.textContent = "Edit";

        editBtn.onclick = () =>
            editTask(task.id);


        const deleteBtn =
            document.createElement("button");

        deleteBtn.className = "delete-btn";

        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = () =>
            deleteTask(task.id);


        buttons.appendChild(completeBtn);

        buttons.appendChild(editBtn);

        buttons.appendChild(deleteBtn);


        li.appendChild(info);

        li.appendChild(buttons);

        taskList.appendChild(li);

    });


    updateCounter();

}


// Complete / Undo
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    displayTasks();
}


// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const newText =
        prompt("Edit your task:", task.text);


    if (newText === null) {

        return;

    }


    if (newText.trim() === "") {

        alert("Task cannot be empty!");

        return;

    }


    task.text = newText.trim();

    saveTasks();

    displayTasks();
}


// Delete Task
function deleteTask(id) {

    const confirmDelete =
        confirm("Delete this task?");


    if (!confirmDelete) {

        return;

    }


    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();
}


// Filter
function setFilter(filter) {

    currentFilter = filter;

    displayTasks();
}


// Save
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Counter
function updateCounter() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;


    document.getElementById("taskCount").textContent =
        `${total} Total | ${active} Active | ${completed} Completed`;
}


// Initial display
displayTasks();