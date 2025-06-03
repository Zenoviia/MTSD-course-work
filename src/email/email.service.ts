import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { EMAIL } from 'src/constants/enums/email';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: EMAIL.SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendConfirmationEmail(email: string, token: string) {
    const confirmationUrl = `${EMAIL.CONFIRM_LINK}${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: EMAIL.SUBJECT,
      text: `${EMAIL.TEXT} ${confirmationUrl}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}