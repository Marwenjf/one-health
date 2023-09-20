const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize
  ('sante', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

exports.testConnection = () => {
  return new Promise((resolve, reject) => {
    sequelize.authenticate()
      .then(() => resolve('Connection has been established successfully.'))
      .catch((err) => reject('Unable to connect to the database'))
  })
}

const Doctor = sequelize.define('doctor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  speciality: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

exports.addDoctor = (name, email, phone,speciality,image) => {
  return new Promise((resolve,reject)=>{
    Doctor.sync({ force: false }).then(() => {
      Doctor.create({
        name: name,
        email: email,
        phone: phone,
        speciality:speciality,
        image:image
      }).then((doctor) => {
        resolve(doctor)
      }).catch((err) => {
        reject(err)
      })
    })
    .catch((err) => { reject(err) })
  })
}

exports.deleteDoctor = (doctorId) => {
  return new Promise((resolve,reject)=>{
      Doctor.destroy({ where: { id: doctorId } })
      .then((result) => {
        resolve({index:result})
      }).catch((err) => {
        reject(err)
      })
    })
}

exports.getAllDoctors=()=>{
  return new Promise((resolve,reject)=>{
    Doctor.findAll()
    .then((doctors) => {
      resolve(doctors)
    }).catch((err) => {
      reject(err)
    })
  })
}


exports.getDoctor=(id)=>{
  return new Promise((resolve,reject)=>{
    Doctor.findOne({where : { id: id}})
    .then((doctor) => {
      resolve(doctor)
    }).catch((err) => {
      reject(err)
    })
  })
}

exports.updateDoctor = (id,name, email, phone) => {
  return new Promise((resolve,reject)=>{
      Doctor.update({
        name: name,
        email: email,
        phone: phone
      },{where:{id:id}})
      .then((count) => {
        resolve(count)
      }).catch((err) => {
        reject(err)
      })
    })
    
}
