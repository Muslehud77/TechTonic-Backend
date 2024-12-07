
import nodemailer from 'nodemailer';
import config from '../config';


const sendEmail = async (email: string, html: string, subject: string) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.sender_email,
      pass: config.sender_app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

return await transporter.sendMail({
  from: 'TechTonic', // sender address
  to: email, // list of receivers
  subject, // Subject line.
  //text: "Hello world?", // plain text body
  html, // html body
});
};





const generatePasswordResetEmail = (name: string, resetLink: string) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 25px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>Password Reset Request</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. If you made this request, please click the link below to reset your password:</p>
          <a href="${resetLink}" class="btn">Reset Your Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
            <p>Best regards,</p>
            <p>The TechTonic Team</p>
          </div>
        </div>
      </body>
    </html>
  `;
};


export const EmailHelper = {
  sendEmail,
  generatePasswordResetEmail,
};