const {News} = require("../Database/News");

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);


// For image storage 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

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


// const saveData = async(req, res, next) => {
    
//     upload.single('profileImage');
    

//     const { name } = req.body;
//     const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

//     if (name && profileImage) {
//         const newData = new DataModel({
//             name,
//             profileImage,
//         });

//         newData.save()
//             .then(() => {
//                 res.json({ success: true });
//             })
//             .catch((error) => {
//                 res.status(500).json({ success: false, error: error.message });
//             });
//     } else {
//         res.status(400).json({ success: false, error: 'Missing name or profile image.' });
//     }


   
//     // try{
//     //     console.log(req);
//     //     res.status(200).send({});
//     // }catch(err){
//     //     res.status(500).json({ error: "Internal Server Error" });
//     //     console.log('Error is here : ', err);
//     // }
//  }







const fetchAll = async(req, res, next) => {

    try{
        let allNews = await News.find();
        const updatedNews = await getUpdateNews(allNews);
        return  res.status(200).send(updatedNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}

// featch data for given keyword Search
const fetchAllByKeyword = async(req, res, next) => {

    const {keyword} = req.params;
    console.log({keyword});

    const regex = new RegExp(keyword, 'i');

    const conditions = {heading : regex};

    try{
        let allNews = await News.find(conditions);
        const updatedNews = await getUpdateNews(allNews);
        return  res.status(200).send(updatedNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}


 async function getUpdateNews(allNews){

    //const imagesData = [];

    for (const news of allNews) {

        if(news.imageUrl != null && news.imageUrl != ''){

            const imagePath = path.join(__dirname, '../uploads', news.imageUrl);
            console.log({ imagePath });
        
                if (fs.existsSync(imagePath)) {
                    
                    console.log('inside if block');
                    const imageBuffer = await readFileAsync(imagePath, { encoding: 'base64' });
                    console.log('console print 1');
                    const imageData = `data:image/jpeg;base64,${imageBuffer}`;
                    console.log('console print 2');
        
                    //imagesData.push(imageData);
                    news.imageUrl = imageData;
                    console.log({news});
                } else {
                    news.imageUrl = null;
                // imagesData.push(null);
                }
        }
        
    }
    console.log('Returing all news');
    return allNews;

}


const fetchPublishedNews = async(req, res, next) => {

    const conditions = {isPublished : true};

    try{
        let allNews = await News.find(conditions);
        const updatedNews = await getUpdateNews(allNews);
        return  res.status(200).send(updatedNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error fetch Published News" });
    }

}

const fetchHotNews = async(req, res, next) => {

    const conditions = {isHot : true};

    try{
        let allNews = await News.find(conditions);
        const updatedNews = await getUpdateNews(allNews);
        return  res.status(200).send(updatedNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error Fetch Hot News" });
    }

}
const fetchTodaysNews = async(req, res, next) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const conditions = {publishedDate : { $gte: today, $lt: new Date(today.getTime() + 86400000) }};

    try{
        let allNews = await News.find(conditions);
        const updatedNews = await getUpdateNews(allNews);
        return  res.status(200).send(updatedNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const fetchOne = async (req, res, next) => {
    console.log('Fetch One is running');
    try{
        const {id }= req.params;
        const news = await News.findById(id);
        let allNews = [];
        allNews[0] = news;
        const updatedNews = await getUpdateNews(allNews);
        return  res.status(200).send(updatedNews[0]);
            
    } catch{
        res.status(500).json({ error: "Internal Server Error Fetch one" });
    }

}

async function syncImageWithUrl(imageUrl){
    const imagePath = path.join(__dirname, '../uploads', imageUrl);
    console.log('image url is : ' + imageUrl)
    console.log({imagePath})

    if (fs.existsSync(imagePath)) {
        console.log('inside if blog');
        const imageBuffer = await readFileAsync(imagePath, { encoding: 'base64' });
        console.log('console print 1');
        const imageData = `data:image/jpeg;base64,${imageBuffer}`;
        console.log('console print 2')

        return imageData;
  
       // res.status(200).send({ ...news.toObject(), imageUrl: imageData });
       // res.status(200).send(news);
      }

      return null;

}


////

async function syncImagesWithUrlList(imageUrls) {
    const imagesData = [];

    for (const imageUrl of imageUrls) {
        const imagePath = path.join(__dirname, '../uploads', imageUrl);

        console.log('image url is: ' + imageUrl);
        console.log({ imagePath });

        if (fs.existsSync(imagePath)) {
            console.log('inside if block');
            const imageBuffer = await readFileAsync(imagePath, { encoding: 'base64' });
            console.log('console print 1');
            const imageData = `data:image/jpeg;base64,${imageBuffer}`;
            console.log('console print 2');

            imagesData.push(imageData);
        } else {
            imagesData.push(null);
        }
    }

    return imagesData;
}



async function updateNewsImageUrls(newsList, imageDataList) {
    const updatedNewsList = newsList.map(news => {
        const matchingImageData = imageDataList.find(imgData => imgData.newsId === news.id);

        if (matchingImageData) {
            // Update the imageUrl with the imageData
            return { ...news, imageUrl: matchingImageData.imageData };
        }

        // No matching imageData found, return the original news object
        return news;
    });

    return updatedNewsList;
}




const deleteNews = async(req, res, next) => {
    console.log('Delete News is running')
    try{
        const {id }= req.params;
        console.log(id);
        const news = await News.findByIdAndDelete(id);
        return res.status(200).send(news);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateNews = async (req, res, next) => {
 //  Before updating new image delete the old one
 console.log('Started Updating News 9');

    let body = req.body;
    console.log({body});

    const imageName = req?.file?.filename || '';

    try{
        const updatedNews = await News.findOneAndUpdate({_id: body._id}, {...body,imageUrl:imageName} );
        console.log('Success fully Updated from database');
        
        res.status(200).send(updatedNews);
    }catch(err){
        res.status(500).json({ error: "Internal Server Error on update News" });
        console.log('Error is here : ', err);
    }
}

const create = async(req, res, next) => {

    console.log('Started creating News 9');

    let body = req.body;
    console.log({body});

    const imageName = req?.file?.filename || '';

    try{
        const createdNews = await News.create({...body,imageUrl:imageName});
        return res.status(200).send(createdNews);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error : Filed to Create News" });
      }

}



module.exports = {
    create,
    fetchAll,
    fetchOne,
    deleteNews,
    updateNews,
    fetchHotNews,
    fetchTodaysNews,
    fetchPublishedNews,
    fetchAllByKeyword,
    //saveData
}


