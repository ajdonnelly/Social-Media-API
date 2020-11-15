const { User, Thought } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find()
      .select('-__v')
      .then((dbUserData) => { 
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // get single user by id
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user exists with this id!' });
        } 
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => { 
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate( { _id: req.params.userId }, { $set: req.body,}, { runValidators: true, new: true, })
      .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user with this id!' });
            return; 
        }
        res.json(dbUserData);
      })  
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // delete user 
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id!' });
            return;
        }
        Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        return; 
    })
      .then(() => { 
        res.json({ message: 'User and all their thoughts deleted!' });
      }) 
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // create new friend
  createNewFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id!' });
            return;
        }
        res.json(dbUserData);
      }) 
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // erase friend
  eraseFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id!' });
         return; 
        }
        res.json(dbUserData);
      }) 
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
