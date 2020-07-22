const router = require('express').Router();
let User = require('../models/user.model');
let Watch = require('../models/watcher.model');
let Authentication = require('../authentication.js')
const bcrypt = require('bcrypt')


//Watches ROUTES
//#########################################################

router.get('/Watches',Authentication,async(req,res) => {
        const Watches = await Watch.find()
        res.send(Watches)
})

router.post('/addWatch',Authentication,async(req,res) => {
  
        if(req.user.admin) {
            try {
                console.log(req.user.admin)
                const newWatch = new Watch(req.body)
                newWatch.save()
                console.log('Wykon')
                res.send(newWatch)
            } catch (err) {
                throw new Error(err.msg)
            }
           
        } else {
            res.status(500).send('You are not admin')
        }
})

//User ROUTES
//#########################################################

//REJESTRACJA

router.post('/register',async(req,res) => {
        try {
            const newUser = new User(req.body)
            newUser.save()
            res.send(newUser)
        } catch (err) {
            throw new Error(err.msg)
        }
})

//UŻYTKOWNICY

router.get('/Users',async(req,res) => {
    const Uzytkownicy = await User.find()
    res.send(Uzytkownicy)
})

//LOGOWANIE

router.post('/login',async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
          } catch (e) {
              res.status(400).send('No acces!'+e)
          }
});

module.exports = router;