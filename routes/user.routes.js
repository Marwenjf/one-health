var route = require('express').Router()
var bodyParser = require('body-parser').urlencoded({'extends':true})

let users =[
    {id:1,name:"user 1",speciality:"spec1"},
    {id:2,name:"user 2",speciality:"spec2"},
    {id:3,name:"user 3",speciality:"spec3"},
    {id:4,name:"user 4",speciality:"spec4"},
    {id:5,name:"user 5",speciality:"spec5"}
]

route.get('/',(req,res)=>{
    res.send(users)
 })
 
 route.get('/:id',(req,res)=>{
     let id = req.params.id
     let user = users.find(user => user.id==id)
     if (user) {
         res.send(user)
     }
     else{
         res.send('Not Found')
     }
 })
 
 
 route.post('/',bodyParser,(req,res)=>{
     let index = users.reduce((prev, current) => {
         return prev.id > current.id ? prev.id : current.id;
       });
     index++
     let user = {
         id:index,
         name:req.body.name,
         speciality:req.body.speciality
     }
     users.push(user)   
     res.send(users)
  })
 
  route.put('/:id',bodyParser,(req,res)=>{
     // get id from request
     let id = req.params.id
     // find user by id
     let user = users.find(user=> user.id == id)
     // update user
     user.name=req.body.name
     user.speciality= req.body.speciality
     res.send(user) 
  })
 
  route.delete('/:id',(req,res)=>{
     let id = req.params.id
     let user = users.find(user=> user.id == id)
     let pos = users.indexOf(user)
     if (!user) {
         res.send('user not found')
     }
     users.splice(pos,1)
     res.send(users)
  })

  module.exports = route