let express = require("express");
let dotenv = require("dotenv");
let path = require("path");
let app = express();
dotenv.config({ path: path.join(__dirname, ".env") });
let sequelize = require("./db/connection");

//routes
let tourRouter = require("./routes/tourRoutes");
let userRouter = require("./routes/userRoutes");
//models
let Tour = require("./models/Tour/Tour");
let TourStartDates = require("./models/Tour/TourStartDate");
let Location = require("./models/Tour/Location");
let Image = require("./models/Tour/Image");
let User = require("./models/User/User");

//Body-parser
app.use(express.json());

//api v1
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//error handler
app.use((err, req, res, next) => {
  res.send(err.message);
});

//associations
Tour.StartDates = Tour.hasMany(TourStartDates, { onDelete: "CASCADE" });
Tour.Locations = Tour.hasMany(Location, { onDelete: "CASCADE" });
Tour.Images = Tour.hasMany(Image, { onDelete: "CASCADE" });

//sync all tables
sequelize.sync({ force: false });
let PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`on port ${PORT}`));
