import App from "./app"
import { SubscriberController, PublisherController } from "./api/controller"

const port = process.env.PORT || 8000
const init = async () => {
    try {
        const app = new App([
            new SubscriberController(),
            new PublisherController()
        ], port)
        app.listen()
    } catch (error) {
        console.log(`failed to start server due to: ${error}`)
    }

}
init()