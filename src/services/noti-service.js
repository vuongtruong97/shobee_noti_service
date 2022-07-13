const amqplib = require('amqplib')

const amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672'

//test queue
const notiService = async () => {
    try {
        const queue = 'test queue'
        const connection = await amqplib.connect(amqp_url, 'heartbeat=60')

        const channel = await connection.createChannel()

        var exchange = 'exchange'
        const routeKey = 'error'

        channel.assertExchange(exchange, 'direct', {
            durable: true,
        })

        await channel.bindQueue(queue, exchange, routeKey)
        await channel.assertQueue(queue, { durable: true })

        await channel.consume(
            queue,
            async function (message) {
                console.log(message.fields)
                console.log(message.content.toString())

                _io.timeout(5000).emit('noti', message.content.toString())

                channel.ack(message)
            },
            {
                // automatic acknowledgment mode,
                // see ../confirms.html for details
                noAck: false,
            }
        )
    } catch (error) {
        console.log(error)
    }
}

module.exports = notiService
