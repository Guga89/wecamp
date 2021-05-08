const Joi = require('joi');

module.exports.campSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
    // image: Joi.array().required()
})

module.exports.reviewSchema = Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required()
})