import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false); 
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState(''); 

  useEffect(() => {
    getTasks();
  }, []);

  function getTasks() {
    axios.get('http://localhost:8080/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }

  function addTask() {
    if (!title) return;
    axios.post('http://localhost:8080/api/tasks', {
      title: title,
      description: description
    })
    .then(() => {
      setTitle('');
      setDescription('');
      setShowAddForm(false);
      getTasks();
    });
  }

  function deleteTask(id) {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(() => getTasks());
  }

  function toggleTask(id) {
    axios.patch(`http://localhost:8080/api/tasks/${id}/toggle`)
      .then(() => getTasks());
  }

  function clearDone() {
    const doneTasks = tasks.filter(t => t.done);
    doneTasks.forEach(t => {
      axios.delete(`http://localhost:8080/api/tasks/${t.id}`)
        .then(() => getTasks());
    });
  }

  function startEdit(task) {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  }

  function saveEdit() {
    if (!editTitle) return;
    axios.put(`http://localhost:8080/api/tasks/${editingTask}`, {
      title: editTitle,
      description: editDescription,
      done: tasks.find(t => t.id === editingTask).done
    })
    .then(() => {
      setEditingTask(null);
      setEditTitle('');
      setEditDescription('');
      getTasks();
    });
  }


  function cancelEdit() {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'done') return task.done;
    if (filter === 'notdone') return !task.done;
    return true;
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>To-Do App</h1>

      <div>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Anuluj' : 'Dodaj nowe zadanie'}
        </button>
        <button onClick={clearDone}>Wyczyść wykonane</button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <span>Filtr: </span>
        <button onClick={() => setFilter('all')}>Wszystkie</button>
        <button onClick={() => setFilter('done')}>✔ Wykonane</button>
        <button onClick={() => setFilter('notdone')}>✘ Niewykonane</button>
      </div>

      {showAddForm && (
        <div style={{ marginTop: '20px', border: '2px solid #007bff', padding: '15px', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
          <h2>➕ Dodaj nowe zadanie</h2>
          <div>
            <label>Tytuł: </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Opis: </label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button onClick={addTask}>Dodaj zadanie</button>
          <button onClick={() => setShowAddForm(false)}>Anuluj</button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {filteredTasks.map(task => (
          <div key={task.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            {editingTask === task.id ? (
              <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px' }}>
                <div>
                  <label>Tytuł: </label>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>
                <div>
                  <label>Opis: </label>
                  <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                </div>
                <button onClick={saveEdit}>💾 Zapisz</button>
                <button onClick={cancelEdit}>❌ Anuluj</button>
              </div>
            ) : (
              <div>
                <h3>{task.done ? '✅' : '🟦'} {task.title}</h3>
                <p>Opis: {task.description}</p>
                <button onClick={() => toggleTask(task.id)}>
                  {task.done ? '✘ Oznacz jako niewykonane' : '✔ Oznacz jako wykonane'}
                </button>
                <button onClick={() => startEdit(task)}>✏️ Edytuj</button>
                <button onClick={() => deleteTask(task.id)}>🗑 Usuń</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;