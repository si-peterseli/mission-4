
// Header
const widgetTime = document.querySelector('.header-widget__time')
const widgetDate = document.querySelector('.header-widget__date')

// To do
const todoEl = document.querySelector('.task-group--todo .task-group__content');
const todoBadge = document.querySelector('.task-group--todo .task-group__badge');
const todoEmptyStateEl = document.querySelector('.task-group--todo .empty-state');

const doneEl = document.querySelector('.task-group--done .task-group__content');
const doneBadge = document.querySelector('.task-group--done .task-group__badge');
const doneEmptyStateEl = document.querySelector('.task-group--done .empty-state');

const overdueEl = document.querySelector('.task-group--overdue .task-group__content');
const overdueBadge = document.querySelector('.task-group--overdue .task-group__badge');
const overdueEmptyStateEl = document.querySelector('.task-group--overdue .empty-state');

const todoListEls = document.querySelectorAll('.todo-list');

// Form
const todoFormEl = document.querySelector('.todo-form');
const formTextarea = document.querySelector('.form-group__textarea');
const prioritySelectors = document.querySelectorAll('.priority-selector__input');
const dateTimeInp = document.querySelector('.form-group__input--date');
const submitBtn = document.querySelector('.submit-btn');
const closeFormBtn = document.querySelector('.close-form-btn');
const openFormBtn = document.querySelector('.open-form-btn');

// Filter
const todayBtn = document.querySelector('.today-btn');
const filterDateInp = document.querySelector('.filter-date');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dateResetBtn = document.querySelector('.date-reset-btn');

// Footer
const clearAllBtn = document.querySelector('.clear-all-btn');

// Default todos
const todos = [
  {
    id: '1',
    title: 'Menyelesaikan mission 1 (First Stage)',
    priority: 'low',
    done: false,
    overdue: false,
    dueDate: '2026-09-19T23:59',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    title: 'Menyelesaikan mission 2 (Git)',
    priority: 'medium',
    done: true,
    overdue: false,
    dueDate: '2026-09-20T23:59',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    title: 'Menyelesaikan mission 3 (HTML & CSS)',
    priority: 'high',
    done: true,
    overdue: false,
    dueDate: '2026-10-04T23:59',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '4',
    title: 'Menyelesaikan mission 4 (Javascript)',
    priority: 'high',
    done: true,
    overdue: false,
    dueDate: '2026-10-11T23:59',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '5',
    title: 'Eksplor proyek to do list - mission 4',
    priority: 'low',
    done: false,
    overdue: false,
    dueDate: (new Date()).setHours(23, 59),
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];


let currentPriority = 'low';
let isFiltered = false;

const titleFormat = text => [text[0].toUpperCase(), ...text.slice(1)].join('');

const dateIdFormat = dateInp => {
  const date = new Date(dateInp);

  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Asia/Jakarta'
  });

  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date)
  };
};

const dateHeaderFormat = dateInp => {
  const date = new Date(dateInp);

  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  });

  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  });

  const dayFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long'
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
    day: dayFormatter.format(date)
  };
}

const setCurrentTime = () => {
  const currentDate = Date.now();
  const { date, time, day } = dateHeaderFormat(currentDate);

  widgetDate.textContent = `${day}, ${date}`;
  widgetTime.textContent = time.replaceAll('.', ':');
};

const startTime = () => {
  const tick = () => {
    setCurrentTime();

    const delay = 1000 - (Date.now() % 1000);
    setTimeout(tick, delay);
  };
  tick();
};
startTime();

const getRelativeDateLabel = targetDateInp => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const target = new Date(targetDateInp);
  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffTime = targetDate - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return 'Hari ini'
    case 1:
      return 'Besok'
    case -1:
      return 'Kemarin'
  }

  return target.toLocaleDateString('id-ID', { weekday: 'long' });
};

const checkOverdue = () => {
  const now = new Date();

  todos.forEach(todo => {
    const dueDate = new Date(todo.dueDate);
    todo.overdue = dueDate < now;
  });
};
checkOverdue();

const filterTodoByDate = (todos, dateFilter) => {
  todos = todos.filter(todo => {
    const date = new Date(todo.dueDate);
    return formatDate(date) === dateFilter;
  });

  return todos;
};

const updateTodoUI = (target, dateFilter = undefined) => {
  let filteredTodos, targetEl, targetBadge, targetEmptyState;

  if (target === 'todo') {
    filteredTodos = todos
      .filter(todo => !todo.done && !todo.overdue)
      .sort((a, b) => a.updatedAt - b.updatedAt);
    
    dateFilter && (filteredTodos = filterTodoByDate(filteredTodos, dateFilter));

    targetEl = todoEl;
    targetBadge = todoBadge;
    targetEmptyState = todoEmptyStateEl;
  } else if (target === 'done') {
    filteredTodos = todos
      .filter(todo => todo.done)
      .sort((a, b) => a.updatedAt - b.updatedAt);

    dateFilter && (filteredTodos = filterTodoByDate(filteredTodos, dateFilter));

    targetEl = doneEl;
    targetBadge = doneBadge;
    targetEmptyState = doneEmptyStateEl;
  } else if (target === 'overdue') {
    filteredTodos = todos
      .filter(todo => todo.overdue && !todo.done)
      .sort((a, b) => a.updatedAt - b.updatedAt);

    dateFilter && (filteredTodos = filterTodoByDate(filteredTodos, dateFilter));

    targetEl = overdueEl;
    targetBadge = overdueBadge;
    targetEmptyState = overdueEmptyStateEl;
  }

  targetBadge.textContent = filteredTodos.length;

  if(filteredTodos.length === 0) {
    targetEmptyState.style.display = 'block';
    targetEl.style.display = 'none';

    return;
  }

  targetEmptyState.style.display = 'none';
  targetEl.style.display = 'flex';

  targetEl.innerHTML = '';
  let html = '';
  filteredTodos.forEach(todo => {
    const { date, time } = dateIdFormat(todo.dueDate);
    const relativeDay = getRelativeDateLabel(todo.dueDate);

    let dateText;
    if (target === 'done') {
      dateText = `
        Selesai
        <div class="duedate-tooltip">
          <i class="ri-timer-line"></i>
          ${relativeDay}, ${date} (${time.replace('.', ':')})
        </div>
      `;
    } else {
      dateText = `
        ${relativeDay}, ${date} (${time.replace('.', ':')})
        <div class="duedate-tooltip">
          <i class="ri-timer-line"></i> Tenggat waktu
        </div>
      `;
    }

    html += `
      <article class="task-item task-item" data-task-id=${todo.id}>
        <div class="task-item__priority-mark priority-mark--${todo.priority}"></div>
        
        <label class="task-checkbox">
          <input type="checkbox" class="task-checkbox__input" ${todo.done ? 'checked' : ''} />
          <span class="task-checkbox__custom">
            <i class="ri-check-line task-checkbox__icon"></i>
          </span>
        </label>

        <div class="task-item__details">
          <h4
            class="task-item__title"
            ${todo.done ? 'style="text-decoration: line-through"' : ''}
          >${todo.title}</h4>
          <div class="task-item__meta">
            <span class="priority-badge priority-badge--${todo.priority}">${titleFormat(todo.priority)}</span>
            <div class="task-item__dot"></div>
            <div class="task-item__date ${target === 'overdue' ? 'task-item__date--overdue' : ''}">${dateText}</div>
          </div>
        </div>

        <button type="button" class="btn-delete">
          <i class="ri-close-large-line btn-delete__icon"></i>
        </button>
      </article>
    `;
  });

  targetEl.innerHTML = html;
}

const updateAllTodoUI = (dateFilter = undefined) => {
  checkOverdue();
  updateTodoUI('todo', dateFilter);
  updateTodoUI('done', dateFilter);
  updateTodoUI('overdue', dateFilter);
};

updateAllTodoUI();

const checkTask = e => {
  const checkbox = e.target.closest('.task-checkbox__input');

  if (checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const taskId = taskItem.dataset.taskId;
  
    const selectedTodo = todos[todos.findIndex(todo => todo.id === taskId)];
    selectedTodo.done = !selectedTodo.done;
    selectedTodo.updatedAt = Date.now();
  
    if (isFiltered) updateAllTodoUI(formatDate(new Date(filterDateInp.value)));
    else updateAllTodoUI();

    return;
  }
};

const deleteTask = e => {
  const deleteButton = e.target.closest('.btn-delete');
  
  if(deleteButton) {
    const taskItem = deleteButton.closest('.task-item');
    const taskId = taskItem.dataset.taskId;

    const selectedTodoIndex = todos.findIndex(todo => todo.id === taskId);
    todos.splice(selectedTodoIndex, 1);

    if (isFiltered) updateAllTodoUI(formatDate(new Date(filterDateInp.value)));
    else updateAllTodoUI();

    return;
  }
}

todoListEls.forEach(el => {
  el.addEventListener('change', e => checkTask(e));
  el.addEventListener('click', e => deleteTask(e));
});

prioritySelectors.forEach(select => {
  select.addEventListener('change', e => currentPriority = e.target.value);
});

const resetFormValues = () => {
  formTextarea.value = '';
  dateTimeInp.value = '';
};

submitBtn.addEventListener('click', e => {
  e.preventDefault();
  
  if (formTextarea.value.trim() === '' || !dateTimeInp.value) {
    alert('Isi semua input!');
    return;
  }

  const dateValue = new Date(dateTimeInp.value);
  console.log(dateTimeInp.value);

  const newTodo = {
    id: crypto.randomUUID(),
    title: formTextarea.value.trim(),
    priority: currentPriority,
    done: false,
    overdue: false,
    dueDate: dateValue.toISOString(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  todos.push(newTodo);
  updateAllTodoUI();
  resetFormValues();
  openForm('close');
});

clearAllBtn.addEventListener('click', () => {
  const result = confirm('Apakah kamu yakin ingin menghapus semua tugas?');
  if(!result) return;

  todos.length = 0;
  updateAllTodoUI();
});

const openForm = (state) => {
  state === 'open' && todoFormEl.classList.add('form-active');
  state === 'close' && todoFormEl.classList.remove('form-active');
};

openFormBtn.addEventListener('click', () => openForm('open'))
closeFormBtn.addEventListener('click', e => {
  e.preventDefault();
  openForm('close');
});

const formatDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getSelectedDate = () => {
  if (filterDateInp.value) {
    const [year, month, day] = filterDateInp
      .value
      .split('-')
      .map(Number);
    
    return new Date(year, month - 1, day);
  }
};

const changeDate = amount => {
  const date = getSelectedDate();
  date.setDate(date.getDate() + amount);
  filterDateInp.value = formatDate(date);
};

prevBtn.addEventListener('click', () => {
  changeDate(-1);
  updateAllTodoUI(formatDate(new Date(filterDateInp.value)));
  isFiltered = true;
});
nextBtn.addEventListener('click', () => {
  changeDate(+1);
  updateAllTodoUI(formatDate(new Date(filterDateInp.value)));
  isFiltered = true;
});

filterDateInp.addEventListener('change', () => {
  updateAllTodoUI(formatDate(new Date(filterDateInp.value)));
  isFiltered = true;
});

todayBtn.addEventListener('click', () => {
  filterDateInp.value = formatDate(new Date());
  updateAllTodoUI(filterDateInp.value);
  isFiltered = true;
});

dateResetBtn.addEventListener('click', () => {
  filterDateInp.value = '';
  updateAllTodoUI();
  isFiltered = false;
});