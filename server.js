var express = require('express')
var path = require('path')
var userRoute = require('./routes/user.routes')

var app  = express()

app.use(express.urlencoded({'extends':true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'assets')))

app.use('/user',userRoute)
app.set('view engine','ejs')
app.set('views','views')
let users =[
    {id:1,name:"user 1",speciality:"spec1"},
    {id:2,name:"user 2",speciality:"spec2"},
    {id:3,name:"user 3",speciality:"spec3"},
    {id:4,name:"user 4",speciality:"spec4"},
    {id:5,name:"user 5",speciality:"spec5"}
]

app.get('/',(req,res)=>{
    res.locals.title = 'Home'
    res.render('index',{page_name:'index'})
})
/*app.get('/',(req,res,next)=>{
    res.send("<form method='post' action='/add'><input type='text' name='username' /><button>Send</button></form>")
})*/

app.post('/add',(req,res,next)=>{
    let username = req.body.username
    res.send('welcome username '+username) 
})


app.get('/about',(req,res,next)=>{
    res.locals.title = 'About'
    //res.sendFile(__dirname)
    //res.sendFile(path.join(__dirname,'views','index.html'))
    res.render('about',{page_name:'about'})
})

app.get('/doctors',(req,res,next)=>{
    res.locals.title = 'Doctors'
    res.render('doctors',{page_name:'doctors'})
})

app.get('/contact',(req,res)=>{
    res.locals.title = 'Contact'
    res.render('contact',{page_name:'contact'})
})

app.get('/blog',(req,res)=>{
    res.locals.title = 'Blog'
    res.render('blog',{page_name:'blog'}) 
})


app.get('/blog-details',(req,res)=>{
    res.locals.title = 'Blog details'
    res.render('blog-details',{page_name:'blog-details'})
})

app.get('/login',(req,res)=>{
    res.locals.title = 'Login'
    res.render('login',{page_name:'login'}) 
})

app.get('/register',(req,res)=>{
    res.locals.title = 'Register'
    res.render('register',{page_name:'register'}) 
})



app.listen(3000,()=>{
    console.log('Express server is started')
})