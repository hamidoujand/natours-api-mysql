let express = require("express");
let app = express();

let PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => console.log(`on port ${PORT}`));
