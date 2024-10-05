import express from 'express';

const app = express();

app.get("/", function (req, res) {
    res.status(200).json({
        message: "welcome to elib apis"
    });
});

export { app };