const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    heading : String,
    subHeading : String,
    detailNews : String,
    publishedDate: Date,
    author : String,
    imageUrl : String,
    videoUrl : String,
    isPublished : Boolean,
    isHot : Boolean
})

const News = mongoose.model("News", newsSchema);
module.exports = {
    News
}