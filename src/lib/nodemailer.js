const nodemailer = require('nodemailer')
const { NODEMAIL_USERNAME, NODEMAIL_PASSWORD, NODEMAIL_HOST, NODEMAIL_PORT } = process.env
const path = require('path')
const ejs = require('ejs')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: NODEMAIL_HOST,
    port: +NODEMAIL_PORT,
    secure: true,
    auth: {
        user: NODEMAIL_USERNAME,
        pass: NODEMAIL_PASSWORD,
    },
})

class Email {
    constructor(data) {
        this.data = data
        this.from = `FreeLancer`
        this.text = `FreeLancer`
        this.to = data.email
    }

    async send(template, subject = 'FreeLancer') {
        try {
            let mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html: await ejs.renderFile(
                    path.join(__dirname, `../mail-template/${template}.ejs`),
                    {
                        data: this.data.payload,
                    }
                ),
            }
            const info = await transporter.sendMail(mailOptions)

            console.log(info)
        } catch (error) {
            console.log(error)
        }
    }

    async sendWellCome() {
        await this.send('newEmployee', 'Chào mừng thành viên mới')
    }
    async sendCancelation() {
        await this.send('cancelation', 'Tài khoản của bạn đã bị khoá')
    }
    async sendResetPassword() {
        await this.send('forgotPassword', 'Quên mật khẩu')
    }
}
module.exports = Email
