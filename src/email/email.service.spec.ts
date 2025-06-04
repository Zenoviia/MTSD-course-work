import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';
import { EMAIL } from '../constants/enums/email/email';

// 🔧 Мокаємо nodemailer
jest.mock('nodemailer');
const sendMailMock = jest.fn();

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    // 💡 Мокаємо createTransport перед кожним тестом
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send confirmation email with correct options', async () => {
    const testEmail = 'user@example.com';
    const token = '12345token';
    const expectedUrl = `${EMAIL.CONFIRM_LINK}${token}`;

    await service.sendConfirmationEmail(testEmail, token);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: EMAIL.SUBJECT,
      text: `${EMAIL.TEXT} ${expectedUrl}`,
    });
  });

  it('should throw error if sendMail fails', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('SMTP Error'));

    await expect(
      service.sendConfirmationEmail('user@example.com', 'badtoken'),
    ).rejects.toThrow('Email could not be sent');
  });
});
