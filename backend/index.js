const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const redis = require('redis');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});
redisClient.connect().catch(console.error);
redisClient.on('error', (err) => console.error('Redis Error:', err));
redisClient.on('connect', () => console.log('Redis connected!'));



const mongoClient = new MongoClient(process.env.MONGO_URI);
let mongoCollection;

(async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('todo');
    mongoCollection = db.collection('tasks');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();

const mqttClient = mqtt.connect('mqtts://04d3ca21d70e422fb18ba39f9ce65b60.s1.eu.hivemq.cloud:8883', {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });
  
const REDIS_KEY = 'FULLSTACK_TASK_AvdhootKurhe';

mqttClient.on('connect', () => {
  console.log('MQTT connected');
  console.log("MQTT Connected?", mqttClient.connected);
  mqttClient.subscribe('/add', (err) => {
    if (err) console.error('MQTT Subscribe error:', err);
  });
});



mqttClient.on('message', async (topic, message) => {
    if (topic === '/add') {
      const newTask = message.toString();
      let tasks = [];
  
    
    const cache = await new Promise((resolve, reject) => {
        redisClient.get(REDIS_KEY, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      console.log("Raw cache:", cache);
      if (cache) console.log("Parsed cache:", JSON.parse(cache));
      
      if (cache) {
        try {
          tasks = JSON.parse(cache);
        } catch (err) {
          console.error('Error parsing cache JSON:', err);
          tasks = [];
        }
      }
  
      tasks.push(newTask);
  
      if (tasks.length > 50) {
        await mongoCollection.insertMany(tasks.map(t => ({ text: t })));
        await redisClient.set(REDIS_KEY, JSON.stringify([]));
        console.log('Flushed to MongoDB');
      } else {
        await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
      }
    }
  });
  

app.get('/fetchAllTasks', async (req, res) => {
    try {
      const dbTasks = await mongoCollection.find({}).toArray();
      const redisCache = await new Promise((resolve, reject) => {
        redisClient.get(REDIS_KEY, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      const cachedTasks = redisCache ? JSON.parse(redisCache) : [];
      console.log("Here : "+cachedTasks);
      
      const allTasks = [...cachedTasks, ...dbTasks.map(t => t.text)];
      res.json(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
