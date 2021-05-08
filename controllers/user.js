const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const userRegister = await User.register(user, password)
        req.login(userRegister, (err) => {  //so user after registration would be directly logged in
            if (err) return next(err);
            req.flash('success', 'Welcom to Yelp Camp!')
            res.redirect('/')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginFormRender = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', "Welcome back!")
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}