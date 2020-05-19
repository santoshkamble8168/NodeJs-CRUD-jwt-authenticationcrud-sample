const Joi = require('@hapi/joi');

//User Registration validation
const userRegisterValidation = reqBody => {
    const UserSchema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).required()
    });
    return UserSchema.validate(reqBody);
}

//User login validation
const userLoginValidation = reqBody => {
    const UserSchema = Joi.object({
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).required()
    })
    return UserSchema.validate(reqBody);
}

module.exports.UserRegisterValid = userRegisterValidation;
module.exports.UserLoginValid = userLoginValidation;