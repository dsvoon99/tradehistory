var User = require("../models/User")
const bcrypt = require("bcrypt");

const userLogin = async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).send({ "error": "Email or password is invalid."})
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({ "error": "Email or password is invalid."})
    }

    //Create a session and send status 200
    req.session.isAuthenticated = true
    req.session.email = email
    req.session.userId = user.id

    return res.status(200)

}

const userSignUp = async(req, res) => {
    const { email, password } = req.body
    // Encrypt the password
   const salt = await bcrypt.genSalt(12);

   //generate the hashed version of users password
   const hashed_password = await bcrypt.hash(password, salt);

    // new user
    var user = new User({
        email: email,
        password: hashed_password
    })

    user.save().then(event => res.sendStatus(200)).catch(error => {
        return res.status(400).send({ "error": error.errors.map(item => item.message)})
    })
}

const userLogout = (req, res) => {
   req.session.destroy()
}


module.exports.userLogin = userLogin;
module.exports.userSignUp = userSignUp;
module.exports.userLogout = userLogout;