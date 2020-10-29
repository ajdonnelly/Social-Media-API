const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createNewFriend,
  eraseFriend,
} = require('../../controllers/user-controller');

router
.route('/')
.get(getAllUsers)
.post(createUser);

router
.route('/:userId')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

router
.route('/:userId/friends/:friendId')
.post(createNewFriend)
.delete(eraseFriend);

module.exports = router;
