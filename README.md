# 📝 ToDo App - Assignment

This project is a basic **ToDo App** built with:
- **Backend:** Node.js, Express.js, Redis, MQTT
- **Frontend:** React.js
- **Deployment:** Render (backend) + Netlify (frontend)

---

## ✨ Features
- Add new tasks
- View list of tasks
- Real-time task updates using MQTT
- Store tasks temporarily in Redis
- Clean and simple user interface

---

## 🏗️ Project Structure

```
todo-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   └── TaskList.js
│   │   └── App.css
│   ├── package.json
│   └── README.md
└── README.md (this file)
```

## 🔥Backend 
Install dependencies
```
npm install express redis mqtt cors
```
Create the .env file and include the following details within it.
```
PORT=5000
MONGO_URI=your mongoDB url
REDIS_URL=Redis url
MQTT_USERNAME=User_name 
MQTT_PASSWORD=Password
```

 Start Backend Server
```
cd backend
node index.js
```
## ⚛️ Frontend Setup

Install dependencies
```
npm install react react-dom mqtt axios
```
Check the MQTT is connected or not
Start Frontend App
```
cd frontend
npm start
```
## 🚀 Deployment
- Backend: [Render](https://todo-backend-yvqc.onrender.com/fetchAllTasks)

- Frontend: [Netlify](https://noteapp-mqtt-ak.netlify.app/)

## 🔮 Future Work
- Add User Authentication (Login/Signup)
- Save notes per user instead of global list
- Improve real-time updates for multiple users
