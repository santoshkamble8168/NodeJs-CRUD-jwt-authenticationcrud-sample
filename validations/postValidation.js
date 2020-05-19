const Joi = require('@hapi/joi');

//Insert Post vadidation 
const postValidation = reqBody => {
    const PostSchema = Joi.object({
        title: Joi.string().min(5).required().messages({
            'string.empty': 'Please provide Title'
        }),
        content: Joi.string().required(),
        //image: Joi.string().required()
    })
    return PostSchema.validate(reqBody, { abortEarly: false});
}

module.exports.PostValidation = postValidation;