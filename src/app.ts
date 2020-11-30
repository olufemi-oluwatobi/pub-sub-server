import * as express from "express"
import * as bodyParser from "body-parser"
import dotenv from 'dotenv'
import path from "path"
import request from "request"
import PubSub from "./pubSub"

/** set up dot env */

dotenv.config({ path: path.resolve(process.cwd(), ".env") })
interface Controller {
    router: express.Router,
    path: string
}

const pubSub = new PubSub();

pubSub.on("event", async (eventName: string, data: string) => {
    try {
        /** get list of subsrcibing urls */
        const subscribers = await pubSub.getEventSubscribers(eventName)
        console.log(subscribers)
        if (subscribers) {
            const subscribersList: Array<string> = JSON.parse(subscribers)
            /** forward data to subscribed urls  */
            const promises = subscribersList.map((url: string) => request.post({
                uri: url, json: JSON.parse(data)
            }).on("error", (error) => console.log(error)));
            Promise.all(promises)
        }
    } catch (error) {
        console.log(error)
    }
})

class App {
    public app: express.Application
    public port: number

    constructor(controllers: Controller[], port: number) {
        this.app = express.default()
        this.port = port;
        this.initializeMiddlewares();
        this.initializeDefaultRoutes()
        this.initializeControllers(controllers)
    }

    private initializeDefaultRoutes() {
        /** set up base route */
        this.app.get("/", (req, res) => {
            res.json({
                success: true,
                message: "running pub sub server"
            })
        })
        /** set up event endpoint for viewing requests */
        this.app.post("/events", (req, res) => {
            console.log(req.body)
        })
    }



    private initializeMiddlewares() {
        this.app.use(bodyParser.json())

        this.app.use((req, res, next) => {
            /** inject pub sub instance to request object */
            req.pubSub = pubSub
            next()
        })
    }

    /** set up contollers */
    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller: Controller) => {
            this.app.use("/", controller.router)
        })
    }
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`)
        })
    }
}
export default App