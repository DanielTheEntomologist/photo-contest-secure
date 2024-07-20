const Voter = require("../models/Voter.model");

/****** SUBMIT VOTER ********/

exports.loadAllVotes = async (req, res) => {
  try {
    const clientId = req.clientId;
    const voter = await Voter.findOne({ user: clientId });
    if (!voter) {
      res.json([]);
    }
    res.json(voter.votes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

exports.addVoter = async (id) => {
  try {
    let voter = await Voter.findOne({ user: id });
    if (!voter) {
      const newVoter = new Voter({ user: user_id, votes: [] });
      await newVoter.save();
      voter = newVoter;
    }
    return voter;
  } catch (err) {
    console.log(err);
  }
};

exports.addVote = async (id, photo_id) => {
  try {
    let voter = await Voter.findOne({ user: id });
    if (!voter) {
      const newVoter = new Voter({ user: id, votes: [] });
      await newVoter.save();
      voter = newVoter;
    }
    if (voter.votes.includes(photo_id)) {
      return "already voted";
    } else {
      voter.votes.push(photo_id);
      await voter.save();
      return "vote added";
    }
  } catch (err) {
    console.log(err);
  }
};
