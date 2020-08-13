const router = require('express').Router();
let User = require('../models/user.model');
let Watch = require('../models/watcher.model');
let Authentication = require('../authentication.js')
const bcrypt = require('bcrypt')

const multer = require('multer')

const upload = multer({
  dest:'images',
  limits:{
      fileSize:1000000
  },
  fileFilter(req,file,cb) {
      //file.originalname.match(/\.(jpg|png)$/)
      if(!file.originalname.endsWith('.jpg')) {
        return cb(new Error('File must be a JPG'))
      }
    cb(undefined,true)
  }
})

router.post('/upload',upload.single('upload'),async(req,res) => {
    res.send('photo sended !')
},(error,req,res,next) => {
    res.status(400).send({error:error.message})
})

//Watches ROUTES
//#########################################################

router.get('/newWatches',async(req,res) => {
        const Watches = await Watch.find().sort({addDate:-1}).limit(4)
        res.send(Watches)
})

router.get('/bestWatches',async(req,res) => {
    const Watches = await Watch.find().sort({watchOverallRatio:-1}).limit(2)
    res.send(Watches)
})

router.get('/Watches',async(req,res) => {
    const Watches = await Watch.find().populate('comments.postedBy','login _id')
    res.send(Watches)
})

router.get('/Watches/:id',async(req,res) => {
    try {
        const Watches = await Watch.findById(req.params.id).populate('comments.postedBy','login userPhoto')
    res.send(Watches)
    } catch(err) {
        res.status(500).send('Błąd')
    }
})

router.post('/addWatch',async(req,res) => {
        // if(req.user.admin) {
            try {
                const newWatch = new Watch(req.body)
                newWatch.save()
                res.send(newWatch)
            } catch (err) {
                throw new Error(err.msg)
            }
        // } else {
        //     res.status(500).send('You are not admin')
        // }
})


//####################### USER ##################################

//REJESTRACJA UZYTKOWNIKA
router.post('/register',async(req,res) => {
        try {
            const newUser = new User(req.body)
            newUser.save()
            res.send(newUser)
        } catch (err) {
            throw new Error(err.msg)
        }
})

//WSZYSCY UŻYTKOWNICY
router.get('/Users',async(req,res) => {
    const Uzytkownicy = await User.find().populate('friendsInvitation.friendInvitation favorite.favoriteProduct friends.friend','login userPhoto watchMark _id watchPhotos watchPrice watchStyle watchCollection watchGlass watchMechanism')
    res.send(Uzytkownicy)
})

//JEDEN UŻYTKOWNIK
router.get('/user/:id',async(req,res) => {
    const user = await User.findById(req.params.id).populate('favorite.favoriteProduct wishList.wishProduct friends.friend','_id  login watchMark _id watchPhotos watchPrice watchStyle watchCollection watchGlass userPhoto watchMechanism')
    res.send(user)
})

//ZAPRASZANIE DO ZNAJOMYCH
router.post('/inviteUserToFriends/:id',Authentication,async(req,res) => {

    const userPrivacyInvitations = await User.findById(req.params.id)
    const otherUser = await User.findById(req.params.id).populate('favorite.favoriteProduct wishList.wishProduct','watchMark _id watchPhotos watchPrice watchStyle watchCollection watchGlass watchMechanism')
    const tab1 = userPrivacyInvitations.friends.map((item) => {return item.friend._id})
    const tab2 = req.user.friends.map((item) => {return item.friend._id})
    console.log(userPrivacyInvitations)
    if(userPrivacyInvitations.friendsInvitation.some((invitation) =>
     {  return invitation.friendInvitation._id == req.user.id})){
        console.log('Wykonuje sie')
       return res.status(500).send('Wysłałeś już zaproszenie!') }
    if(req.user.friends.some((friend) => {return friend.friend._id == req.params.id})){
        console.log('Jest juz w znajomych')
       return  res.status(500).send('Osoba jest juz w znajomych!')
    }

    const check = tab1.filter(function(n) {return tab2.indexOf(n) !== -1;})
 
    switch(userPrivacyInvitations.invitations) {
        case "Wszyscy":
            try {
                // req.user.friendsInvitation = req.user.friendsInvitation.concat({friendInvitation:req.params.id})
                otherUser.friendsInvitation = otherUser.friendsInvitation.concat([{friendInvitation:req.user.id}])
                otherUser.save()
                req.user.save()
                res.send('Wysłano zaproszenie do znajomych')
            } catch(err) {
                throw new Error('Błąd dodania do znajomych dla opcji - wszyscy')
            }  
        break;
        case "Nikt":
            res.status(500).send('Nie możesz dodac osoby do znajomych')
        break;
        case "Znajomi znajomych":
            if(check.length > 0) {
                // req.user.friendsInvitation = req.user.friendsInvitation.concat({friendInvitation:req.params.id})
                otherUser.friendsInvitation = otherUser.friendsInvitation.concat([{friendInvitation:req.user.id}]) 
                req.user.save()
                otherUser.save()
                res.send('Znaleziono wspólnych znajomych - dodano znajomego') 
            }else {
                res.send('Nie ma wspólnych znajomych') 
            }
        break;
        default:
          res.status(500).send('Please choice option')
      } 
})

//AKCEPTOWANIE ZAPROSZENIA DO ZNAJOMYCH
router.post('/acceptInviteUserToFriends/:idPersonWhoInvite',Authentication,async(req,res) => {
    const userWhoInvite = await User.findById(req.params.idPersonWhoInvite)
    const myId = [{friend:req.user.id}]
    userWhoInvite.friends = userWhoInvite.friends.concat(myId)
    const updatedFriends = userWhoInvite.friendsInvitation.filter(
        (item) => item.friendInvitation._id != req.user.id)
    const updatedMyFriends = req.user.friendsInvitation.filter(
        (item) => item.friendInvitation._id != req.params.idPersonWhoInvite)
    req.user.friendsInvitation = updatedMyFriends
    userWhoInvite.friendsInvitation = updatedFriends
    const userWhoInviteId = [{friend:userWhoInvite._id}]
    req.user.friends = req.user.friends.concat(userWhoInviteId)
    const me = req.user
    userWhoInvite.save()
    req.user.save()
    res.send({userWhoInvite,me})
})

//ODRZUCENIE ZAPROSZENIA DO ZNAJOMYCH
router.post('/rejectInviteUserToFriends/:idPersonWhoInvite',Authentication,async(req,res) => {
    const userWhoInvite = await User.findById(req.params.idPersonWhoInvite)
    try {
        req.user.friendsInvitation = req.user.friendsInvitation.filter(
            (mySide) => mySide.friendInvitation._id != req.params.idPersonWhoInvite)
        userWhoInvite.friendsInvitation = userWhoInvite.friendsInvitation.filter(
            (hisSide) => hisSide.friendInvitation._id != req.user.id)
            req.user.save()
            userWhoInvite.save()
        res.send({userWhoInvite,me})
    } catch (err) {
        throw new Error('Nie możesz odrzucić zaproszenia')
    } 
})

//USUNIĘCIE ZE ZNAJOMYCH
router.post('/deleteUserFromMyFriends/:idPersonWhoIDelete',Authentication,async(req,res) => {
    const userWhoIDelete = await User.findById(req.params.idPersonWhoIDelete)
    try {
        req.user.friends = req.user.friends.filter(
            (item) =>{ return item.friend._id != req.params.idPersonWhoIDelete})
            userWhoIDelete.friends = userWhoIDelete.friends.filter(
            (item) =>{ return item.friend._id != req.user.id})
            const me = req.user
            req.user.save()
            userWhoIDelete.save()
        res.send('Usunięto ze znajomych')
    } catch (err) {
        throw new Error('Bład przy usunieciu ze znajomych')
    } 
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

router.post('/logout',Authentication,async (req, res) => {
    req.user.tokens = []
    req.user.save()
    res.send("Log out")
});

router.get('/myprofile',Authentication,async (req, res) => {
    User.find(req.user._id).populate('friendsInvitation.friendInvitation wishList.wishProduct favorite.favoriteProduct friends.friend shoppingCart.product','login userPhoto _id watchMark _id watchPhotos watchOverallRatio watchNumberOfComments watchPrice watchStyle watchCollection watchGlass watchMechanism')
    .then(watch => res.json(watch))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/changePassword',Authentication,async (req, res) => {
        req.user.password = req.body.password
        console.log('Hasło zmienione')
        req.user.save()
        res.send('Password changed')
})

router.post('/changeData',Authentication,async (req, res) => {
    req.user.name = req.body.name,
    req.user.surname = req.body.surname,
    req.user.city = req.body.city,
    req.user.street = req.body.street,
    req.user.numberOfHome = req.body.numberOfHome,
    req.user.postalCode = req.body.postalCode
    req.user.save()
    res.send(req.user)
})

router.post('/changePrivate',Authentication,async (req, res) => {
    req.user.displayData = req.body.displayData,
    req.user.displayDataForUnknown = req.body.displayDataForUnknown,
    req.user.displayDataInPosts = req.body.displayDataInPosts,
    req.user.whoDisplayDataInPosts = req.body.whoDisplayDataInPosts,
    req.user.invitations = req.body.invitations,
    req.user.listOfFriends = req.body.listOfFriends
    req.user.save()
    res.send(req.user)
})

router.post('/addPhoto',Authentication,async (req, res) => {
    req.user.userPhoto = req.body.userPhoto
    req.user.save()
    res.send(req.user)
})

router.post('/deleteProfile',Authentication,async (req, res) => {
    const user = await User.findByCredentials(req.body.email,req.body.password)
    req.user.remove()
})

router.post('/addToFavorite/:id',Authentication,async (req, res) => {
    if(req.user.favorite.some((item) => item.favoriteProduct._id == req.params.id )){
        res.status(500).send("Produkt jest juz w koszyku")
    } else {
    const objectFavorite = [{favoriteProduct:req.params.id}]
    req.user.favorite = await req.user.favorite.concat(objectFavorite)
    req.user.save()
    res.send(req.user)
    }
})

router.post('/removeFromFavorite/:id',Authentication,async (req, res) => {
        const updated = req.user.favorite.filter((item) => {return item._id != req.params.id})
        req.user.favorite = updated
        req.user.save()
        res.send(req.user)
})

router.post('/addToShoppingCart/:id',Authentication,async (req, res) => {
    if(req.user.shoppingCart.some((item) => item._id == req.params.id )){
        res.status(500).send("Produkt jest juz w koszyku")
    } else {
    const objectShoppingCart = [{product:req.params.id}]
    req.user.shoppingCart = await req.user.shoppingCart.concat(objectShoppingCart)
    req.user.save()
    res.send(req.user)
    }
})

router.post('/removeFromShoppingCart/:id',Authentication,async (req, res) => {
        const updated = req.user.shoppingCart.filter((item) => {return item._id != req.params.id})
        req.user.shoppingCart = updated
        req.user.save()
        res.send(req.user)
})

router.post('/removeAllFromShoppingCart',Authentication,async (req, res) => {
    req.user.shoppingCart = []
    req.user.save()
    res.send(req.user)
})

router.post('/addToWishList/:id',Authentication,async (req, res) => {
    if(req.user.wishList.some((item) => item._id == req.params.id )){
        res.status(500).send("Produkt jest juz w koszyku")
    } else {
    const objectWishList = [{wishProduct:req.params.id}]
    req.user.wishList = await req.user.wishList.concat(objectWishList)
    req.user.save()
    res.send(req.user)
    }
})

router.post('/removeFromWishList/:id',Authentication,async (req, res) => {
        const updated = req.user.wishList.filter((item) => {return item._id != req.params.id})
        req.user.wishList = updated
        req.user.save()
        res.send(req.user)
})

router.post('/addComment/:id',Authentication,async (req, res) => {
    const watch = await Watch.findById(req.params.id)
    const comment = [{
        comment:req.body.comment,
        commentRatio:req.body.commentRatio,
        postedBy:req.user.id
    }]
    watch.comments = watch.comments.concat(comment)
    const ocenatab = watch.comments.map(item => item.commentRatio)
    const ocena = ocenatab.reduce((total,value) => {return total+value})
    watch.watchNumberOfComments = ocenatab.length
    watch.watchOverallRatio = Math.round(ocena / watch.watchNumberOfComments)
    watch.save()
    res.send(watch)
})

router.post('/deleteComment/:id/comment/:comment',Authentication,async (req, res) => {
    const watch = await Watch.findById(req.params.id)
    const comment = watch.comments.find((item) => item._id == req.params.comment)
    if(comment.postedBy._id == req.user.id) {
        const updated = watch.comments.filter((item) => item._id != req.params.comment )
        watch.comments = updated
        watch.save()
    } else {
        res.status(500).send('Nie mozna usunać')
    }
    res.send(watch)
})



module.exports = router;