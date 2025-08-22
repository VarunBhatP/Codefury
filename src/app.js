import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"



const app = express()

//CORS Middle ware

app.use(
    cors(//allow access for all
        {
            origin: process.env.CORS_ORIGIN
        }
    )
)


//Allow json data transfer within app

app.use(
    express.json(
        
    )
)

//to make constant routs like some take %20, some take +, we ensure constant
app.use(
    express.urlencoded(
        {
            extended:true,
        }
    )
)


//direct fetchable files
app.use(
    express.static(
        "public"
    )
)

app.use(
    cookieParser(

    )
)

//configuring routes
import { userRouter } from "./routes/user.routes.js"
app.use('/api/users',userRouter);

import artRouter from "./routes/art.routes.js"
app.use('/api/art',artRouter);

import orderRouter from "./routes/order.routes.js";
app.use("/api/orders", orderRouter);

import shareRouter from "./routes/share.routes.js";
app.use("/api/shareLink", shareRouter); 

import { ApiError } from "./Utils/Api_Error.utils.js"
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }

    // Default handler for unhandled errors
    res.status(500).json({
        status:500,
        success: false,
        message: err.message || "Internal Server Error"
    });
    throw err;
});

export {app}