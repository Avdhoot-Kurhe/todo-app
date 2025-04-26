import React from 'react';
import '../App.css';

export const TaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={index} className="task-item">
          {task}
        </div>
      ))}
    </div>
  );
};
