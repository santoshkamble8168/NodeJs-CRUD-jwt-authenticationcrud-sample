const router = require('express').Router();
UserModel = require('../models').User;
const {UserRegisterValid, UserLoginValid} = require('../validations/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../settings/config');

router.post('/register', async (req, res) => {
    try {
        
        //Check req data is valid or not
        const {error} = UserRegisterValid(req.body);
        if(error) return res.status(400).send(error.details);

        //Check user is exist or not
        const emailExist = await UserModel.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send({status:false, message: 'Email is already exist'})
        
        //Create hash password
        const slat = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, slat);

        //create a new user
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const saveUser = await user.save();
        res.send({status: true, message: 'User created', id:user._id})
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    //check validation
    const {error} = UserLoginValid(req.body);
    if(error) return res.status(400).send(error.details);

    //check email exist
    const user = await UserModel.findOne({email: req.body.email});
    if(!user) return res.status(400).send({message:"Email not exists!"});

    //check password
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send({error:true, message:"Invalid password"})

    //create a token
    //Token contain Payload and privtate secret key
    const token = jwt.sign({id:user._id, role:"user"}, config.secret.token)
    res.header('token', token).send({status: true, message:'logged in successfully'});

});

module.exports = router;