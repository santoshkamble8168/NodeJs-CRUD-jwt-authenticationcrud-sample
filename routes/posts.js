const router = require('express').Router();
const verifyToken = require('./tokenmiddleware');
const { PostValidation} = require('../validations/postValidation');
const PostModel = require('../models/posts');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Image upload config
var postImageStorageDir = 'postImages/'
postImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!fs.existsSync(postImageStorageDir)){
            fs.mkdir(postImageStorageDir);
        }
        cb(null, postImageStorageDir);
    },
    filename: (req, file, cb) => {
        var fileName = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        cb(null, fileName);
    }
});

var uploadPostImage = multer({
    //storage: postImageStorage
    storage: postImageStorage, fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true);
    }
});

router.get('/', verifyToken, async(req, res) => {
    try {
        const posts = await PostModel.find().select({__v:0})
        .then(posts => {
            if(posts){
                res.status(200).send(posts)
            }else{
                res.status(400).send({status: false, message: 'Posts not found'});
            }
        })
        .catch(error => {
            res.status(400).send({status: false, message: 'Posts not found'});
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/:id', verifyToken, async(req, res) => {
    try {
        const post = await PostModel.findById(req.params.id).select({__v:0})
        .then(post => {
            if(post){
                res.status(200).send(post);
            }else{
                res.status(400).send({status: false, message: 'Post not found'});  
            }
        }).catch( error => {
            res.status(400).send({status: false, message: 'Post not found'});
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

//uploadPostImage.single('image'),
router.post('/', verifyToken, uploadPostImage.single('image'), async(req, res) => {
    try {
        //Check req data is valid or not
        const {error} = PostValidation(req.body);
        if(error) return res.status(400).send({status: false, message: error.details});

        //Check post title is exist or not
        const titleExist = await PostModel.findOne({title: req.body.title});
        if(titleExist) return res.status(400).send({status: false, message: 'Title is aready exist'})

        //Create new post
        if(req.file){
            var newPost =  new PostModel({
                title: req.body.title,
                content: req.body.content,
                image: req.file.path
            });
        }else{
            var newPost =  new PostModel({
                title: req.body.title,
                content: req.body.content
            });
        }
        
        const savePost = await newPost.save()
        .then(savePost => {
            if(savePost){
                res.send({status: true, message: 'Post created', post: savePost});
            }else{
                res.status(400).send({status: false, message: 'Something went wrong!'});
            }
        })
        .catch( error => {
            res.status(400).send(error);    
        });
        
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/:id', verifyToken, uploadPostImage.single('image'), async(req, res) => {
    try {
        if(req.file){
            var updatePost = await PostModel.updateOne(
                {_id: req.params.id},
                {$set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: req.file.path
                }}
            ).then(updatePost => {
                res.send({status: true, message: 'Post updated', post: updatePost});
            }).catch(error => {
                res.status(400).send(error); 
            })
        }else{
            var updatePost = await PostModel.updateOne(
                {_id: req.params.id},
                {$set: {
                    title: req.body.title,
                    content: req.body.content
                }}
            ).then(updatePost => {
                res.send({status: true, message: 'Post updated', post: updatePost});
            }).catch(error => {
                res.status(400).send(error); 
            })
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/:id', verifyToken, async(req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if(post){
            const removePost = await PostModel.remove({_id: req.params.id})
            .then(removedPost => {
                res.send({status: true, message: 'Post removed', removed: removedPost});
            })
            .catch(error => {
                res.send({status: false, message: 'something went wrong!'});
            })
        }else{
            res.send({status: false, message: 'No Post available with id :'+req.params.id});
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;