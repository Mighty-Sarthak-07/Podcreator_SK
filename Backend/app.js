const express = require("express");
const app = express();
const userApi = require("./routes/user");
const CatApi = require("./routes/categories");
const PodcastApi = require("./routes/podcast");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getMaxListeners } = require("./models/user");
require("dotenv").config();
require('./conn/conn');


    app.use(cors({
        origin: [process.env.FRONTEND_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        cookie: {
            maxage: 7*24*60*60*1000, 
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === "production",
        }
    }))

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1",userApi);
app.use("/api/v1",CatApi);
app.use("/api/v1",PodcastApi);

app.listen(process.env.PORT,()=>{
    console.log(`Server started on port: ${process.env.PORT}`);
});