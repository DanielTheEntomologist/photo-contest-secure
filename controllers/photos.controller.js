const Photo = require("../models/photo.model");

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
}

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
  try {
    let { title, author, email } = req.fields;
    const file = req.files.file;

    // escape characters that could be used in HTML injection
    title = escapeHTML(title);
    author = escapeHTML(author);
    email = escapeHTML(email);

    switch (true) {
      case title == null:
        throw new Error("No title!");
      case author == null:
        throw new Error("No author!");
      case email == null:
        throw new Error("No email!");
      case title.length < 1:
        throw new Error("Title is too short!");
      case title.length > 25:
        throw new Error("Title is too long!");
      case author.length < 1:
        throw new Error("Author is too short!");
      case author.length > 50:
        throw new Error("Author is too long!");
      case !/^[0-9a-zA-Z._-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/.test(email):
        throw new Error("Wrong email address!");
      case !file:
        throw new Error("No file!");
      case file.size > 1048576:
        throw new Error("File is too large!");
      case !file.type.includes("image"):
        throw new Error("Wrong file format!");
      case !file.name.match(/\.(jpg|png|gif)$/):
        throw new Error("Wrong file format!");
      default: {
        const fileName = file.path.split("/").slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
        const newPhoto = new Photo({
          title,
          author,
          email,
          src: fileName,
          votes: 0,
        });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {
  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if (!photoToUpdate) res.status(404).json({ message: "Not found" });
    else {
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: "OK" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
