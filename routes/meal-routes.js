const router = require('express').Router()
const Meal = require('../models/meal')
const mealValidation = require('../validation').mealValidation

router.use((req, res, next) => {
  console.log('A request is coming into api.')
  next()
})

router.post('/', async (req, res) => {
  const { error } = mealValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // console.log(req.user.isConsumer());
  let { name, description, price, amount, picture } = req.body
  console.log(req.user)

  let newMeal = new Meal({
    name,
    description,
    price,
    amount,
    picture,
  })

  try {
    await newMeal.save()
    res.status(200).send('New meal has been saved.')
  } catch (error) {
    res.status(400).send('Cannot save meal.')
  }
})

router.get('/', (req, res) => {
  Meal.find({})
    .populate('seller', ['name', 'email', 'avatar'])
    .then((meals) => {
      res.send(meals)
    })
    .catch(() => {
      res.status(500).send('Cannot get meals!!')
    })
})

router.get('/:id', (req, res) => {
  let _id = req.params.id
  Meal.findOne({ _id })
    .then((meal) => {
      res.send(meal)
    })
    .catch((e) => {
      res.send(e)
    })
})

/**
 * 還需要再加上能夠修改餐點的特定對象，ex：使用者不能修改餐點資訊，seller 可以
 * runValidators
 */
router.patch('/:id', async (req, res) => {
  const { error } = mealValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  let _id = req.params.id

  let meal = await Meal.findOne({ _id })

  if (!meal) {
    res.status(404)
    return res.json({
      success: false,
      message: 'Meal not found.',
    })
  }

  Meal.findOneAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then(() => {
      res.send('Meal updated.')
    })
    .catch((e) => {
      res.send({
        success: false,
        message: e,
      })
    })
})

/**
 *
 */
router.delete('/:id', async (req, res) => {
  let _id = req.params.id
  let meal = await Meal.findOne({ _id })

  if (!meal) {
    res.status(404)
    return res.json({
      success: false,
      message: 'Meal not found.',
    })
  }

  Meal.deleteOne({ _id }, req.body)
    .then(() => {
      res.send('Meal deleted.')
    })
    .catch((e) => {
      res.send({
        success: false,
        message: e,
      })
    })
})

module.exports = router
