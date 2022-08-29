const createBody = () => {   //функция, возвращающая шаблон отображения TODO List на странице
    return `
    <h2>TODO List</h2>
    <div class="flex-block"style="">
        <div id="to-do-list">
        </div>
        <div id="selected-to-do-description">
            <h3>Описание TODO (Редактирование)</h3>
            <hr>
            <div id="task-description" class="hidden">
                <div class="flex-block">
                    <h4>Прогресс выполнения</h4>
                    <input type="radio" name="progress" id="await" value="1" checked>
                    <label for="await">Ожидает</label>
                    <input type="radio" name="progress" id="inprogress" value="2">
                    <label for="inprogress">В процессе</label>
                    <input type="radio" name="progress" id="done" value="3">
                    <label for="done">Выполнено</label>
                </div>
                <div class="flex-block">
                    <h4>Название задачи:</h4>
                    <textarea type="text" id="name-description" placeholder="Название">Купить продукты</textarea>
                </div>
                <div class="flex-block">
                    <h4>Описание задачи:</h4>
                    <textarea id="text-description" placeholder="Описание"></textarea>
                </div>
                <div class="flex-block">
                    <button id="save-task-btn">Сохранить</button>
                </div>
                <div class="flex-block">
                    <button id="delete-task-btn">Удалить</button>
                </div>
            </div>
        </div>
    </div>
    `
}

const createTODOList = () => {  //функция, возвращающая шаблон "Список TODO"
    return `
    <h3>Список TODO</h3>
    <div class="flex-block">
        <input type="text" name="search" id="search-input" placeholder="что найти?">
        <button id="search-btn" onclick="showSearchTasks()">Найти</button>
    </div>
    <button id="create-task-btn" onclick="clickButtonCreateTask()">Добавить задачу</button>
    `
}

const createTemplate = (task, index) => {  //функция, возвращающая шаблон краткого описания задачи
    let HProgress, HClass;
    switch (task.progress) {
        case '1': {
            HProgress = "ожидает";
            HClass = "await";
            break;
        }
        case '2': {
            HProgress = "в процессе";
            HClass = "inprogress";
            break;
        }
        case '3': {
            HProgress = "выполнено";
            HClass = "done";
            break;
        }
    } 
    return `
    <div class="task-to-do" onclick="completeTask(${index}, this)">
        <h6 class="${HClass}">${HProgress}</h6>
        <p>${task.name}</p>
    </div>
    `
}

document.body.innerHTML += createBody();  //добавляем шаблон отображения TODO List в DOM

const createTaskBtn = document.getElementById('create-task-btn'); //кнопка создания задачи 
const saveTaskBtn = document.getElementById('save-task-btn'); //кнопка сохранения задачи в список
const delTaskBtn = document.getElementById('delete-task-btn'); //кнопка удаления задачи из списка
const nameTaskInput = document.getElementById('name-description'); //поле ввода названия задачи
const deskTaskInput = document.getElementById('text-description'); //поле ввода описания задачи
const TODOList = document.getElementById('to-do-list'); //область отображения списка всех задач
const taskItem = document.querySelector('.task-to-do'); //блок краткого отображения задачи
const taskDescItem = document.getElementById('task-description'); //блок полного отображения выбранной задачи

let tasks;  //массив задач (массив объектов)

function Task(name, description, progress) {  //функция создания элемента в массиве tasks (шаблон объекта в массиве объектов)
    this.name = name;  //название задачи
    this.description = description;  //описание задачи
    this.progress = progress;  //стадия прогресса выполнения 
}

if (!localStorage.tasks) {  //проверка наличия задач в LocalStorage под ключом 'tasks'
    tasks = [];
} else {
    tasks = JSON.parse(localStorage.getItem('tasks')); //при наличии информации в LocalStorage, необходимо считать информацию от туда для обработки 
}

const updateLocal = () => { //функция добавления/обновления массива tasks в LocalStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));  //записываем массив задач в локальную память для длительного сохранения и работы с информацией
}

const fillHTMLList = () => {    //функция, добавляющая шаблон "Список TODO" в DOM
    if (tasks.length > 0) {
        tasks.forEach((element, index) => {
            TODOList.innerHTML += createTemplate(element, index);  //добавляем шаблон краткого описания задачи в DOM
        });
    }
}

TODOList.innerHTML = createTODOList();  //отрисовываем заголовок, поле поиска и кнопки раздела "Список TODO" в DOM
fillHTMLList();  //отрисовываем "Список TODO" в DOM по хранящимся задачам

let selectTaskIndex = -1;  //индекс выбранной задачи из списка задач (данное значение описывает, что ни одна задача из списка не была выбрана, нажата)

const completeTask = (index, element) => {  //функция, срабатывающая при нажатии на задачу из списка задач в "Список TODO"
    selectTaskIndex = index;  //запоминаем номер выбранной задачи
    taskDescItem.classList.remove("hidden");  //показываем поля описания задачи и кнопки для взаимодействий
    document.querySelectorAll('.task-to-do').forEach((taskElementHTML) => {  //в списке всех элементов краткого отображения задачи ...
        taskElementHTML.classList.remove("selected-task"); // ... убираем визуальное оформление выбранной задачи
    });
    element.classList.add("selected-task");  //добавляем класс отображения нажатого элемента (выбранной задачи)
    nameTaskInput.value = tasks[index].name;  //показываем значение поля "Название задачи" в выбранной задаче
    deskTaskInput.value = tasks[index].description;  //показываем значение поля "Описание задачи" в выбранной задачи
}

const showSearchTasks = () => {  //функция, поиска и отображения задачи по введенной строке
    const searchInput = document.getElementById('search-input');  //поле ввода строки для поиска
    document.querySelectorAll('.task-to-do').forEach((taskElementHTML) => {  //в списке всех элементов краткого отображения задачи ...
        taskElementHTML.remove();  //...удаляем все элементы краткого отображения
    });
    if (searchInput == "") {  //если строка поиска пуста ...
        fillHTMLList();  // выводится весь список задач
        return  //выход из функции для предотвращения дальнейшего выполнения функции
    }
    tasks.forEach((task, index) => {
        if (task.name.includes(searchInput.value)) {  //если значение названия задачи содержит искомую строку
            TODOList.innerHTML += createTemplate(task, index);  //добавляем шаблон краткого описания искомой задачи в DOM
        }
    })
}

const clickButtonCreateTask = () => {  //функция, срабатывающая при нажатии на кнопку "Добавить задачу"
    document.querySelectorAll('.task-to-do').forEach((taskElementHTML) => {  //в списке всех элементов краткого отображения задачи ...
        taskElementHTML.classList.remove("selected-task"); // ... убираем визуальное оформление выбранной задачи
    });
    taskDescItem.classList.remove("hidden");  //скрываем поля описания задачи и кнопки для взаимодействий
    nameTaskInput.value = "";  //стираем данные из поля
    deskTaskInput.value = "";  //стираем данные из поля
    selectTaskIndex = -1;  //сбрасываем индекс выбранной задачи
}

saveTaskBtn.addEventListener('click', () => {  //функция, срабатывающая при нажатии на кнопку "Сохранить"
    const taskProgressList = document.querySelectorAll('input[name="progress"]');  //список input radio
    if (selectTaskIndex != -1) { //проверка была ли выбрана задача для просмотра/изменения
        if (nameTaskInput.value == "") {  //проверка наличия названия задачи (обеспечит отсутствие пустых полей в списке задач)
            alert("Введите название задачи!");
            return
        }
        taskProgressList.forEach( taskProgress => {
            if (taskProgress.checked) {
                tasks[selectTaskIndex] = new Task(nameTaskInput.value, deskTaskInput.value, taskProgress.value); //перезапись выбранного элемента
            }
          })
        alert("Изменения сохранены.");  //оповещение о сохранении внесенных изменений
        nameTaskInput.value = "";  //стираем данные из поля
        deskTaskInput.value = "";  //стираем данные из поля
        selectTaskIndex = -1;  //сбрасываем индекс выбранной задачи
        taskDescItem.classList.add("hidden");  //скрываем поля описания задачи и кнопки для взаимодействий
    } else {
        if (nameTaskInput.value == "") {  //проверка наличия названия задачи (обеспечит отсутствие пустых полей в списке задач)
            alert("Введите название задачи!");
            return
        }
        taskProgressList.forEach( taskProgress => {
            if (taskProgress.checked) {
                tasks.push(new Task(nameTaskInput.value, deskTaskInput.value, taskProgress.value));  //помещаем новые введенные данные в массив задач
            }
          })
        alert("Задача добавлена.");  //оповещение о создании задачи
        nameTaskInput.value = "";  //стираем данные из поля
        deskTaskInput.value = "";  //стираем данные из поля
        taskDescItem.classList.add("hidden");  //скрываем поля описания задачи и кнопки для взаимодействий
    }
    TODOList.innerHTML = createTODOList();  //вновь отрисовываем заголовок, поле поиска и кнопки раздела "Список TODO" в DOM
    updateLocal();  //обновляем LocalStorage
    fillHTMLList();  //отрисовываем "Список TODO" в DOM по хранящимся задачам
})

delTaskBtn.addEventListener('click', () => {  //функция, срабатывающая при нажатии на кнопку "Удалить"
    if (selectTaskIndex != -1) { //проверка была ли выбрана задача для просмотра/изменения
        tasks.splice(selectTaskIndex, 1); //удаляем выбранный элемент из массива задач
        nameTaskInput.value = "";  //стираем данные из поля
        deskTaskInput.value = "";  //стираем данные из поля
        selectTaskIndex = -1;  //сбрасываем индекс выбранной задачи
        taskDescItem.classList.add("hidden");  //скрываем поля описания задачи и кнопки для взаимодействий
        TODOList.innerHTML = createTODOList();  //вновь отрисовываем заголовок, поле поиска и кнопки раздела "Список TODO" в DOM
        updateLocal();  //обновляем LocalStorage
        fillHTMLList();  //отрисовываем "Список TODO" в DOM по хранящимся задачам
        alert("Задача удалена");  //оповещение об удалении задачи
    } else {
        nameTaskInput.value = "";  //стираем данные из поля
        deskTaskInput.value = "";  //стираем данные из поля
        taskDescItem.classList.add("hidden");  //скрываем поля описания задачи и кнопки для взаимодействий
    }
})