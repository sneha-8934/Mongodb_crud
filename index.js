const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Brand = require('./models/Brand')

const app=express();
const port=5007;

//mongo db connection
mongoose.connect('mongodb+srv://demo_mongo:Sneh1234@cluster0.f0gur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connect to mongo DB'))
.catch(err=> console.error('Error connect to mongodb',err))

//middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

// set ejs as view
app.set('view engine', 'ejs')

//routes
//home page
app.get('/',async(req,res)=>{
    try{
        const brands= await Brand.find()
        res.render('index',{brands})
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server error')
    }
})

//Add new brand
app.post('/add',async(req,res)=>{
    try{
        const newBrand = new Brand({
            name:req.body.name,
            description:req.body.description
        })
        await newBrand.save()
        res.redirect('/')
    }
    catch(err){
        console.log(err);
        res.status(500).send('Error adding brand')
    }
})

//edit with id
app.get('/edit/:id', async(req,res) => {
    try{
        const brand=await Brand.findById(req.params.id)
        if(!brand) return res.status(404).send("Brand not found")
            res.render('edit',{brand})
    }
    catch(err){
        console.log(err)
        res.status(500).send(' Server Error')
    }
})

//update brand
app.post('/edit/:id',async(req,res)=> {
    try{
        await Brand.findByIdAndUpdate(req.params.id,req.body)
        res.redirect('/')
    }
    catch(err){
        console.log(err)
        res.status(500).send(' Updating brand Error')
    }
})

//delete brand
app.post('/delete/:id',async(req,res)=> {
    try{
        await Brand.findByIdAndDelete(req.params.id)
        res.redirect('/')
    }
    catch(err){
        console.log(err)
        res.status(500).send(' deleting brand Error')
    }
})

//start sereve
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})


