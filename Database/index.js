const mongoose = require("mongoose");

const connectToDatabase = async () => {
    const dbURI = "mongodb+srv://rajneesh_pal:2tA6hRf4TDaKNYn@first.zvhxaej.mongodb.net/NewsLetter";
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to Database");
    } catch (error) {
        console.log("Error in connecting to Database")
    }
}

module.exports = {
    connectToDatabase,
}