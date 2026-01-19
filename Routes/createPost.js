const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const POST = require('../models/post');
const USER = require('../models/User')


router.post("/createPost", requireLogin, (req, res) => {

    console.log("createpost hit");
    const { body, pic } = req.body;

    if (!pic || !body) {
        return res.status(422).json({ error: "please add all the fields" });
    }

    const post = new POST({
        body,
        photo: pic,
        postedBy: req.user
    });

    post.save()
        .then((result) => {
            return res.json({
                message: "Post is created succesfully",
                post: result
            })

        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: "something went wrong"
            })
        })
})

router.get("/allposts", requireLogin, (req, res) => {
    POST.find()
        .populate("postedBy", "_id name Photo")
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
})

router.get("/myposts", requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(myposts => res.json(myposts))
});

router.get("/myprofile", requireLogin, (req, res) => {
    res.json(req.user);
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $addToSet: { likes: req.user._id }, 
      },
      { new: true }
    ).populate("postedBy", "_id name");

    return res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).populate("postedBy", "_id name");

    return res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }8
});


router.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };

    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name");

    return res.json(result);
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
});


router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await POST.findOne({ _id: postId }).populate(
      "postedBy",
      "_id"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not allowed to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log("Delete post error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});





module.exports = router;










