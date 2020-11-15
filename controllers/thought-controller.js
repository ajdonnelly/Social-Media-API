const { Thought, User } = require('../models');

const ThoughtController = {
//GET to get all thoughts
getAllThoughts(req, res) {
    Thought.find()
      .sort({ createdAt: -1 })
      .then((dbThoughtData) => { 
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
    //GET to get a single thought by its _id
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought with this id!' });
                  return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },

      //POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
      createThought(req, res) {
        Thought.create(req.body)
          .then((dbThoughtData) => {
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: dbThoughtData._id } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'Thought created but no user with this id!' });
            } 
            
            res.json({ message: 'Thank you for your thought!' });
          })
          .catch(err => res.json(err));
      },
    //   PUT to update a thought by its _id
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this id!' });
                return; 
            }
            res.json(dbThoughtData);

          })

          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });

      },
    //   DELETE to remove a thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this id!' });
                return;
            }
    
            // remove thought
            return User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({ message: 'Thought created but no user with this id!' });
            return;
            }
            res.json({ message: 'Thought successfully deleted!' });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },

    //   POST to create a reaction stored in a single thought's reactions array field
    addReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought with this id!' });
            return; 
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
    //   DELETE to pull and remove a reaction by the reaction's reactionId value
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought with this id!' });
                return; 
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
}

module.exports = ThoughtController;
