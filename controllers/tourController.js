let getAllTours = async (req, res, next) => {
  try {
    res.send("tours will be here soon");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTours,
};
