const express = require("express");
const {create, fetchAll, fetchOne, deleteNews,updateNews,fetchPublishedNews,fetchTodaysNews,fetchHotNews} = require("../Handlers/NewsHandler");

const NewsRouter = express.Router();


NewsRouter.post("/create", create);
NewsRouter.get("/fetchAll", fetchAll);
NewsRouter.get("/fetchPublishedNews", fetchPublishedNews);
NewsRouter.get("/fetchTodaysNews", fetchTodaysNews);
NewsRouter.get("/fetchHotNews", fetchHotNews);
NewsRouter.get("/fetchOne/:id", fetchOne);
NewsRouter.get("/delete/:id", deleteNews);
NewsRouter.post("/update", updateNews);


module.exports = {
    NewsRouter
}