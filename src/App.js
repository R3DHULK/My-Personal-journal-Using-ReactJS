import React, { useState, useEffect } from 'react';
import './Journal.css';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [currentTask, setCurrentTask] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const handleTitleChange = (event) => {
    setCurrentTitle(event.target.value);
  };

  const handleInputChange = (event) => {
    setCurrentEntry(event.target.value);
  };

  const handleTaskChange = (event) => {
    setCurrentTask(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentTitle.trim() !== '' && currentEntry.trim() !== '') {
      const newEntry = {
        id: Date.now(),
        title: currentTitle,
        text: currentEntry,
        date: new Date().toLocaleDateString(),
      };

      setEntries((prevEntries) => [...prevEntries, newEntry]);
      setCurrentTitle('');
      setCurrentEntry('');
    }
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();

    if (currentTask.trim() !== '') {
      const newTask = {
        id: Date.now(),
        task: currentTask,
        completed: false,
      };

      setTodoList((prevList) => [...prevList, newTask]);
      setCurrentTask('');
    }
  };

  const handleTaskDelete = (id) => {
    setTodoList((prevList) => prevList.filter((task) => task.id !== id));
  };

  const handleTaskToggle = (id) => {
    setTodoList((prevList) =>
      prevList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEntryDelete = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="journal-container">
      <div className="datetime">
        {currentDateTime}
      </div>
      <h1>Personal Journal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentTitle}
          onChange={handleTitleChange}
          placeholder="Title"
          className="title-input"
        />
        <textarea
          value={currentEntry}
          onChange={handleInputChange}
          placeholder="Write your journal entry..."
          rows={5}
          className="entry-input"
        ></textarea>
        <button type="submit" className="add-button">
          Add Entry
        </button>
      </form>

      <h2>To-Do List</h2>
      <form onSubmit={handleTaskSubmit}>
        <input
          type="text"
          value={currentTask}
          onChange={handleTaskChange}
          placeholder="Add a task..."
          className="task-input"
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>
      {todoList.length > 0 ? (
        <ul className="task-list">
          {todoList.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span className="task-text" onClick={() => handleTaskToggle(task.id)}>
                {task.task}
              </span>
              <button
                onClick={() => handleTaskDelete(task.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks yet.</p>
      )}

      {entries.length > 0 ? (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id} className="entry-item">
              <div className="entry-title">{entry.title}</div>
              <div className="entry-text">{entry.text}</div>
              <div className="entry-date">{entry.date}</div>
              <button
                onClick={() => handleEntryDelete(entry.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No entries yet.</p>
      )}
    </div>
  );
};

export default Journal;
