const { fetchUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
        return res.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
    })
};
