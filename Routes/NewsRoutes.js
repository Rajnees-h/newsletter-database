const express = require("express");
const multer = require("multer");
const {create, fetchAll, fetchOne, deleteNews,updateNews,fetchPublishedNews,fetchTodaysNews,fetchHotNews,fetchAllByKeyword} = require("../Handlers/NewsHandler");

const NewsRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


//NewsRouter.post("/create", create);
NewsRouter.post("/create", upload.single("imageUrl"), create);
NewsRouter.get("/fetchAll", fetchAll);
NewsRouter.get("/fetchPublishedNews", fetchPublishedNews);
NewsRouter.get("/fetchTodaysNews", fetchTodaysNews);
NewsRouter.get("/fetchHotNews", fetchHotNews);
NewsRouter.get("/fetchOne/:id", fetchOne);
NewsRouter.get("/delete/:id", deleteNews);
NewsRouter.post("/update", upload.single("imageUrl"), updateNews);
NewsRouter.get("/fetchAllByKeyword/:keyword",fetchAllByKeyword)
//NewsRouter.post("/saveData",saveData);


module.exports = {
    NewsRouter
}