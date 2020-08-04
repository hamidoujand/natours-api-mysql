let express = require("express");
let dotenv = require("dotenv");
let path = require("path");
//.env config
dotenv.config({
  path: path.join(__dirname, ".env"),
});
//db connections
require("./db/connection");

let tourRouter = require("./routes/tourRoutes");

let app = express();

//api v1
app.use("/api/v1/tours", tourRouter);

let PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`on port ${PORT}`));
