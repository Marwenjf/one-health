const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt')

const sequelize = new Sequelize
  ('sante', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
});

exports.registerAction = (name,email,password) =>{
    return new Promise((resolve,reject)=>{
        User.sync({ force: false }).then(()=>{
            return User.findOne({where: {email:email}})
        }).then(user=>{
            if (user) {
             reject('Email exists')   
            }
            else{
                return bcrypt.hash(password,10)
            }
        })
        .then(hpassword=>{
            let user = {
                name:name,
                email:email,
                password:hpassword
            }
        User.create(user)
        }).then(user=>{
            resolve('registred!')
        })
        .catch(err=>{
            reject(err)
        })
    })
    
}

exports.login = (email, password) => {
    return new Promise((resolve,reject)=>{
        User.sync({ force: false }).then(()=>{
            return User.findOne({where: {email:email}})
        }).then(user=>{
            console.log(user)
            if (user) {
                bcrypt.compare(password,user.password)
                .then((verif)=>{
                    console.log(verif)
                    if (verif) {
                        console.log('yes')
                        console.log(user.id)
                        resolve(user.id)
                    }
                })   
            }
            else{
                console.log('not user')
                reject('User or password error')
            }
        })
        .catch((err)=>{
            console.log('catch')
            reject(err)
        })   
    })
}
