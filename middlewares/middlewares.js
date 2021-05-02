const ExpressError = require('../utils/ExpressErrors')
const { campSchema, reviewSchema } = require('../validationSchemas')

module.exports.validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

