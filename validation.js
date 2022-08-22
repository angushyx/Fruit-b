const Joi = require('joi')

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid('consumer', 'seller'),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    imageUrl: Joi.string(),
  })
  //讓 schema 做驗證
  return schema.validate(data)
}

const signInValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  })
  return schema.validate(data)
}

const mealValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(2).max(500).required(),
    price: Joi.number().min(10).max(9999).required(),
    amount: Joi.number().min(5).max(9999).required(),
    picture: Joi.string().min(2).max(5000).required(),
  })
  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.signInValidation = signInValidation
module.exports.mealValidation = mealValidation
