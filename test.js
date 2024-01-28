const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

// Replace 'your_database_url' with your actual MongoDB connection string
const mongoDBURL = "mongodb+srv://rajneesh_pal:2tA6hRf4TDaKNYn@first.zvhxaej.mongodb.net/NewsLetter";
try {
    mongoose.connect(mongoDBURL);
    console.log("Connected to Database");
} catch (error) {
    console.log("Error in connecting to Database", error)
}

//mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Define a simple Mongoose model
const DataModel = mongoose.model('Data', {
    name: String,
    profileImage: String,
});

// Endpoint to save data to MongoDB
app.post('/saveData', upload.single('profileImage'), (req, res) => {
    const { name } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (name && profileImage) {
        const newData = new DataModel({
            name,
            profileImage,
        });

        newData.save()
            .then(() => {
                res.json({ success: true });
            })
            .catch((error) => {
                res.status(500).json({ success: false, error: error.message });
            });
    } else {
        res.status(400).json({ success: false, error: 'Missing name or profile image.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
