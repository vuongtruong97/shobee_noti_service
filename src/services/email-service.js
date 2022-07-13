const amqplib = require('amqplib')
const Email = require('../lib/nodemailer')

const amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672'

//test queue
const emailService = async () => {
    try {
        const queue = 'email-queue'
        const connection = await amqplib.connect(amqp_url, 'heartbeat=60')

        const channel = await connection.createChannel()

        var exchange = 'email'
        const routeKeys = ['forgot', 'new-user', 'cancelation', 'confirm-user']

        channel.assertExchange(exchange, 'direct', {
            durable: true,
        })

        const q = await channel.assertQueue(queue, { durable: true })

        Promise.all(
            routeKeys.map(async (key) => {
                await channel.bindQueue(q.queue, exchange, key)
            })
        )

        await channel.consume(
            q.queue,
            async function (payload) {
                const data = JSON.parse(payload.content.toString())
                console.log(payload.fields)

                console.log(data)

                // switch (payload.fields.routingKey) {
                //     case 'forgot':
                //         email.sendResetPassword()
                //         break
                //     case 'forgot':
                //         email.sendCancelation()
                //         break
                //     case 'new-user':
                //         const email = new Email(data)
                //         email.sendWellCome()
                //         break
                //     case 'confirm-user':
                //         email.sendWellCome()
                //         break
                // }

                _io.emit('noti', payload.content.toString())

                channel.ack(payload)
            },
            {
                noAck: false,
            }
        )
    } catch (error) {
        console.log(error)
    }
}

module.exports = emailService
