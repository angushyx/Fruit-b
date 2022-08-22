const express = require('express')
const app = express()
// const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 8080

const passport = require('passport')
// require("./config/passport-setup")(passport);
const session = require('express-session')

const authRoutes = require('./routes/auth-routes')
const mealRoutes = require('./routes/meal-routes')

const cors = require('cors')
const path = require('path')

// mongoose
//   .connect(process.env.DB_CONNECT, {
//     maxPoolSize: 50,
//     wtimeoutMS: 2500,
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("Connect to mongodb atlas.");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(session({ secret: process.env.PASSPORT_SECRET }));
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '/client')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
})

app.use('/api/users', authRoutes)
app.use('/api/meals', mealRoutes)

app.get('/', (req, res) => {
  res.send('homepage')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
