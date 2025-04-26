const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let landmarks = [];
let visitedLandmarks = [];

// --- LANDMARKS CRUD ---
app.post('/api/landmarks', (req, res) => {
    const { name, latitude, longitude, description, category } = req.body;
    const newLandmark = {
        id: Date.now(),
        name,
        location: { latitude, longitude },
        description,
        category
    };
    landmarks.push(newLandmark);
    res.status(201).json(newLandmark);
});

app.get('/api/landmarks', (req, res) => {
    res.json(landmarks);
});

app.get('/api/landmarks/:id', (req, res) => {
    const landmark = landmarks.find(l => l.id == req.params.id);
    if (landmark) {
        res.json(landmark);
    } else {
        res.status(404).json({ message: "Landmark not found" });
    }
});

app.put('/api/landmarks/:id', (req, res) => {
    const index = landmarks.findIndex(l => l.id == req.params.id);
    if (index !== -1) {
        landmarks[index] = { ...landmarks[index], ...req.body };
        res.json(landmarks[index]);
    } else {
        res.status(404).json({ message: "Landmark not found" });
    }
});

app.delete('/api/landmarks/:id', (req, res) => {
    landmarks = landmarks.filter(l => l.id != req.params.id);
    res.json({ message: "Landmark deleted" });
});

// --- VISITED LANDMARKS ---
app.post('/api/visited', (req, res) => {
    const { landmark_id, visited_date, visitor_name, visiting_note } = req.body;
    const newVisited = {
        id: Date.now(),
        landmark_id,
        visited_date,
        visitor_name,
        visiting_note
    };
    visitedLandmarks.push(newVisited);
    res.status(201).json(newVisited);
});


// GÜNCELLENEN VERSİYON: Visited liste dönerken ad ve açıklama da veriyoruz
app.get('/api/visited', (req, res) => {
    const enrichedVisited = visitedLandmarks.map(visit => {
        const landmark = landmarks.find(l => l.id == visit.landmark_id);
        return {
            ...visit,
            landmark_name: landmark ? landmark.name : "Unknown Landmark",
            landmark_description: landmark ? landmark.description : "No Description"
        };
    });
    res.json(enrichedVisited);
});

app.get('/api/visited/:id', (req, res) => {
    const visited = visitedLandmarks.find(v => v.id == req.params.id);
    if (visited) {
        res.json(visited);
    } else {
        res.status(404).json({ message: "Visited landmark not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
