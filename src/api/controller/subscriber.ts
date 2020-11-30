import * as express from "express"
import { SubscriberRequestValidator } from "../validation"
import stringIsAValidUrl from "../../helpers/validUrl"


const { subscriberValidator } = SubscriberRequestValidator



class SubscriptionController {
    public path = "/subscribe"
    public router = express.Router()

    constructor() {
        /** initialize subscription routes */
        this.initializeRoutes()
    }
    public initializeRoutes() {
        this.router.post(`${this.path}/:topic`, subscriberValidator, this.subscribe)
    }
    /** subscription controller */
    subscribe = (req: express.Request, res: express.Response) => {
        try {
            const { body, params, pubSub } = req
            const { topic } = params
            const { url } = body;
            console.log(url, topic)

            /** check if the provided url is valid */
            const urlIsValid = stringIsAValidUrl(url)
            if (!urlIsValid) {
                res.status(401).json({
                    success: true,
                    data: "invalid url"
                })
            } else {
                pubSub.subscribe(topic, url)
                res.status(201).json({
                    success: true,
                    data: "subscription succesful"
                })
            }

        }
        catch (error) {
            res.status(501).json({
                success: true,
                data: error
            })
        }
    }

}
export default SubscriptionController