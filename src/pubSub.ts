import { createClient } from "redis"
import EventEmmiter from "events"
import dotenv from 'dotenv'
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

const REDIS_OPTIONS = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
}
const publisher = createClient(REDIS_OPTIONS);
const subscriberClient = createClient(REDIS_OPTIONS);
const store = createClient(REDIS_OPTIONS)

class PubSub extends EventEmmiter {
    constructor() {
        super()
        /** emit event when subscriber client emits a message */
        subscriberClient.on("message", (channel, message) => {
            this.emit("event", channel, message)
        })
    }
    public publish = (eventName: string, data: any): void => {
        publisher.publish(eventName, data)
    }

    /** check redis for event subscribers */
    getEventSubscribers = (event: string): Promise<string | undefined> => {
        return new Promise((resolve, reject) => {
            store.get(event, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    addSubscribers = async (event: string, subscriber: string) => {
        let newSubscriberList: Array<string>
        const subscribers = await this.getEventSubscribers(event)

        newSubscriberList = subscribers ? [...JSON.parse(subscribers), subscriber] : [subscriber]

        /** store updated subsrcibed list, new Set() is used to remove duplicates */
        store.set(event, JSON.stringify([...new Set(newSubscriberList)].filter(Boolean)))
    }



    public subscribe = async (eventName: string, subscriber: string) => {
        try {
            subscriberClient.subscribe(eventName)
            console.log(this.addSubscribers)
            await this.addSubscribers(eventName, subscriber)
        }
        catch (error) {
            console.log(error)
        }

    }

}

export default PubSub