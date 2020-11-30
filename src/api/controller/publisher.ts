import * as express from "express"

class PublishController {
    public path = "/publish"
    public router = express.Router()

    constructor() {
        this.initializeRoutes()
    }
    public initializeRoutes() {
        this.router.post(`${this.path}/:topic`, this.publish)
    }

    publish = (req: express.Request, res: express.Response) => {
        try {
            const { body, params, pubSub } = req
            const { topic } = params
            console.log(topic)
            const data = JSON.stringify({ topic, data: body })
            pubSub.publish(topic, data)
            res.status(201).json({
                success: true,
                data: "publish was succesful"
            })
        }
        catch (error) {
            res.status(501).json({
                success: true,
                data: error
            })
        }
    }

}
export default PublishController