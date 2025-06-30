const mongoose = require("mongoose");

const url = process.env.MONGOOSE_URL;

mongoose.connect(url);
