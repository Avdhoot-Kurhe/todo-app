import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import axios from 'axios';
import { TaskList } from './components/TaskList';
import './App.css';
const mqttClient = mqtt.connect('wss://04d3ca21d70e422fb18ba39f9ce65b60.s1.eu.hivemq.cloud:8884/mqtt', {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  keepalive: 60, 
  reconnectPeriod: 1000, 
  connectTimeout: 30 * 1000,
  clean: true,
});


const App = () => {
  const [note, setNote] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await axios.get('https://todo-backend-yvqc.onrender.com/fetchAllTasks');
    setTasks(res.data);
  };

  const handleAdd = () => {
    if (!note.trim()) return;

    if (mqttClient.connected) {
      mqttClient.publish('/add', note, {}, (error) => {
        if (error) {
          alert('Failed to add task');
        } else {
          alert('Task added successfully');
        }
      });
      setNote('');
      setTimeout(fetchTasks, 100); 
    } else {
      alert('MQTT is not connected yet!');
    }
  };

  useEffect(() => {
    fetchTasks();
    return () => mqttClient.end();
  }, []);

  return (
    <div className="note-app-container">
      <h1 className="note-app-title">📃 Note App</h1>
      <div className="note-input-group">
        <input
          type="text"
          placeholder="New Note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="note-input"
        />
        <button onClick={handleAdd} className="note-add-button">
          ➕ Add
        </button>
      </div>
      <h2 className="note-section-title">Notes</h2>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default App;
