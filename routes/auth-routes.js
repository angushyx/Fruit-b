const router = require('express').Router()
const registerValidation = require('../validation').registerValidation
const signInValidation = require('../validation').signInValidation
const User = require('../models/user-model')
const jwt = require('jsonwebtoken')

router.get('/test', (req, res) => {
  res.send({ a: 1 })
})

/**
 * 使用者 signup 的路由，其中包括驗證功能。
 */
router.post('/signup', async (req, res) => {
  const { error } = registerValidation(req.body)
  console.log(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send('Email is already been registered.')

  /**
   * register the user，如果 google 也要存到 mongodb 就要從 client side 拿到 google login 資料，接著再 new 一個新的 google user，用同一套 model，
   */
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.comparePassword,
    role: req.body.role,
    imageUrl: req.body.imageUrl,
  })

  try {
    const saveUser = await newUser.save()
    res.status(200).send({
      msg: 'success',
      savedObject: saveUser,
    })
  } catch (error) {
    res.status(400).send('User not saved.')
  }
})

router.post('/signIn', (req, res) => {
  const { error } = signInValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err)
    }
    if (!user) {
      res.status(401).send('User not found')
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err)
        if (isMatch) {
          const tokenObject = { _id: user.id, email: user.email }
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET)
          res.send({ success: true, token: 'JWT ' + token, user })
        } else {
          res.status(400).send('Wrong password')
        }
      })
    }
  })
})

module.exports = router
