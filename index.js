let express = require("express");
let dotenv = require("dotenv");
let path = require("path");

//db connections
let sequelize = require("./db/connection");
//Tour models
let Tour = require("./models/Tour");
let TourImages = require("./models/TourImages");
let TourStartDates = require("./models/TourStartDates");
let TourStartLocation = require("./models/TourStartLocation");
let app = express();

//.env config
dotenv.config({
  path: path.join(__dirname, ".env"),
});

let tourRouter = require("./routes/tourRoutes");

//api v1
app.use("/api/v1/tours", tourRouter);

//sync models
sequelize.sync();
let PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`on port ${PORT}`));
