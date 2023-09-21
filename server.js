var express = require('express')
var path = require('path')
var flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
var userRoute = require('./routes/user.routes')
var doctorModel = require('./models/doctor.model')
var authModel = require('./models/auth.model')

var app  = express()

const options = {                 // setting connection options
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sante'
}

const sessionStore = new MySQLStore(options)

app.use(express.urlencoded({'extends':true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'assets')))
app.use(flash())
app.use(
    session({
        secret: 'cookie_secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,      // assigning sessionStore to the session
    })
)
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

app.get('/test',(req,res)=>{
    doctorModel.testConnection()
    .then((msg)=> res.send(msg))
    .catch(err=>res.send(err))
})

app.post('/doctor',(req,res)=>{
    doctorModel.addDoctor(req.body.name,
        req.body.email,
        req.body.phone,
        req.body.speciality,
        req.body.image)
        .then((doctor)=>{
            res.send(doctor)
        })
        .catch(err=> res.send(err))
})

app.delete('/doctor/:id',(req,res)=>{
    doctorModel.deleteDoctor(req.params.id)
    .then((result)=>{
        res.send(result)
    })
    .catch(err=> res.send(err))
})

app.get('/doctor',(req,res)=>{
    doctorModel.getAllDoctors()
    .then((doctors)=>{
        res.send(doctors)
    })
    .catch(err=> res.send(err))
})

app.get('/doctor/:id',(req,res)=>{
    doctorModel.getDoctor(req.params.id)
    .then((doctor)=>{
        res.send(doctor)
    })
    .catch(err=> res.send(err))
})

app.put('/doctor/:id',(req,res)=>{
    doctorModel.updateDoctor(req.params.id,
        req.body.name,req.body.email,req.body.phone)
    .then((doctor)=>{
        res.send(doctor)
    })
    .catch(err=> res.send(err))
})

app.get('/',(req,res)=>{
    res.locals.title = 'Home'
    res.render('index',{verifUser:req.session.userId,page_name:'index'})
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
    res.render('about',{verifUser:req.session.userId,page_name:'about'})
})

app.get('/doctors',(req,res,next)=>{
    var doctors = {}
    doctorModel.getAllDoctors()
    .then((dctrs)=>{
        console.log(dctrs)
        doctors =dctrs
        res.locals.title = 'Doctors'
        res.render('doctors',{verifUser:req.session.userId,page_name:'doctors',doctors})
    })
    .catch(err=> console.log(err))
})

app.get('/doctor-details/:id',(req,res)=>{
    doctorModel.getDoctor(req.params.id)
    .then((dctr)=>{
        let doctor = dctr
        res.locals.title = 'Doctors details'
    res.render('doctor-details',{verifUser:req.session.userId,page_name:'doctor-details',doctor})
    })
    .catch(err=> res.send(err))
})

app.get('/contact',(req,res)=>{
    res.locals.title = 'Contact'
    res.render('contact',{verifUser:req.session.userId,page_name:'contact'})
})

app.get('/blog',(req,res)=>{
    res.locals.title = 'Blog'
    res.render('blog',{verifUser:req.session.userId,page_name:'blog'}) 
})


app.get('/blog-details',(req,res)=>{
    res.locals.title = 'Blog details'
    res.render('blog-details',{verifUser:req.session.userId,page_name:'blog-details'})
})

app.get('/login',(req,res)=>{
    res.locals.title = 'Login'
    res.render('login',{verifUser:req.session.userId,page_name:'login', message: req.flash('error')}) 
})

app.post('/login',(req,res)=>{
    authModel.login(req.body.email,req.body.password)
    .then((id)=>{
        req.session.userId=id
        res.redirect('/')
    }).catch((err)=>{
        req.flash('error',err)
        res.redirect('/login')
    })
})

app.get('/register',(req,res)=>{
    res.locals.title = 'Register'
    res.render('register',{verifUser:req.session.userId,page_name:'register', message: req.flash('error') }) 
})
app.post('/register',(req,res)=>{
    authModel.registerAction(req.body.name,req.body.email,req.body.password)
    .then(user=>{
        res.redirect('/login')
    })
    .catch(err=>{
        //console.log(err)
        req.flash('error', err)
        res.redirect('/register');
    })
})

app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    }) 
})



app.listen(3000,()=>{
    console.log('Express server is started')
})
