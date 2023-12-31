const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./Database");
const app = express();
//const { UserRouter } = require("./Routes/UserRoutes")
const { NewsRouter } = require("./Routes/NewsRoutes")
require('dotenv').config();

app.use(cors());
app.use(express.json());
//app.use(UserRouter);
app.use(NewsRouter);
const PORT = process.env.PORT || 3001;

connectToDatabase()
.then(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Connected to Server on Port ${PORT}`);
        })
    } catch (error) {
        console.log("error in connecting to server")
    }
})