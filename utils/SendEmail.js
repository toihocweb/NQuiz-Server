import nodemailer from 'nodemailer';

class EmailService {
  static init() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    return this;
  }
  static async sendEmail(email, subject, msg) {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: subject,
      text: msg,
    };
    return await this.transporter.sendMail(message);
  }
}

export default EmailService;
