const Joi = require('@hapi/joi')

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        surname: Joi.string().min(2).required(),
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().email().max(255).required()
    })
    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        loginCredit: Joi.string(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.email().max(255).required()
    })
    return schema.validate(data)
}

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation
}
