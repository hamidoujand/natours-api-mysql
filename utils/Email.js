let nodeMailer = require("nodemailer");

class Email {
  constructor(to, subject, text, html) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }
  createTransporter() {
    if (process.env.NODE_ENV === "development") {
      this.transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
    }
  }

  async sendEmail() {
    this.createTransporter();
    await this.transporter.sendMail({
      from: "Natours <natours@gmail.com>",
      to: this.to,
      text: this.text,
      html: this.html,
    });
  }
}

module.exports = Email;
