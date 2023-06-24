const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./configurations/config');

const postRouter = require("./routes/postRoutes");

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected the database."))
    .catch((e) => {
        console.log(e),
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(express.json()); // middleware

app.get("/", (req, res) => {
    res.send("I am alive!");
});

const port = process.env.PORT || 3000;

app.use("/api/v1/posts", postRouter);

app.listen(port, () => console.log(`\nConnected on http://localhost:${port}`));