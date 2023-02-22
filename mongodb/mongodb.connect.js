const mongoose = require("mongoose")

async function connect() {
    const mongoDBUrl = process.env.MONGODB_URL;

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(mongoDBUrl, { useNewUrlParser: true })
    } catch (error) {
        console.error("error connecting to mongodb");
        console.error(error);
    }
}

module.exports = { connect }