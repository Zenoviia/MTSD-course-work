import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { EMAIL } from '../constants/enums/email/email';

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
  try {
    const confirmationUrl = `${EMAIL.CONFIRM_LINK}${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: EMAIL.SUBJECT,
      text: `${EMAIL.TEXT} ${confirmationUrl}`,
    };

    await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
}

}