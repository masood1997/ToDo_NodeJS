import app from "./app.js"
import connectDB from "./data/database.js";

connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on PORT ${process.env.PORT} in ${process.env.MODE} mode`)
});

