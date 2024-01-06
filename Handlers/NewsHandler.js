const {News} = require("../Database/News");

const create = async(req, res, next) => {
    let body = req.body;

    try{
        const createdNews = await News.create(body);
        return res.status(200).send(createdNews);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error : Filed to Create News" });
      }

}

const fetchAll = async(req, res, next) => {

    try{
        let allNews = await News.find();
        allNews.forEach((item) => {
            console.log(item)
        })
    
        return res.status(200).send(allNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const fetchTodaysNews = async(req, res, next) => {

    const conditions = {publishedDate : Date.Today()}

    try{
        let allNews = await News.find();
        allNews.forEach((item) => {
            console.log(item)
        })
    
        return res.status(200).send(allNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const fetchPublishedNews = async(req, res, next) => {

    const conditions = {isPublished : true};

    try{
        let allNews = await News.find(conditions);
        allNews.forEach((item) => {
            console.log(item)
        })
    
        return res.status(200).send(allNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const fetchHotNews = async(req, res, next) => {

    try{
        let allNews = await News.find();
        allNews.forEach((item) => {
            console.log(item)
        })
    
        return res.status(200).send(allNews);
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

}

const fetchOne = async (req, res, next) => {
    console.log('Fetch One is running');
    try{
        const {id }= req.params;
        const news = await News.findById(id);
        res.status(200).send(news);
    } catch{
        res.status(500).json({ error: "Internal Server Error" });
    }

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
    try{
        const news = req.body;
        console.log(req);
        console.log(news);
        console.log('printing news id : ' ,news._id);
        const updatedNews = await News.findOneAndUpdate({_id: news._id}, news );
        res.status(200).send(updateNews);
    }catch(err){
        res.status(500).json({ error: "Internal Server Error" });
        console.log('Error is here : ', err);
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
    fetchPublishedNews
}