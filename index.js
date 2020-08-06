let express = require("express");
let dotenv = require("dotenv");
let path = require("path");
let app = express();
dotenv.config({ path: path.join(__dirname, ".env") });
let sequelize = require("./db/connection");

let tourRouter = require("./routes/tourRoutes");
//models
let Tour = require("./models/Tour");
let TourStartDates = require("./models/TourStartDate");

//Body-parser
app.use(express.json());

//api v1
app.use("/api/v1/tours", tourRouter);

//error handler
app.use((err, req, res, next) => {
  res.send(err.message);
});

//associations
Tour.StartDates = Tour.hasMany(TourStartDates, { onDelete: "CASCADE" });

//sync all tables
sequelize.sync({ force: false });
let PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`on port ${PORT}`));
