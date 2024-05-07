import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Admin 👻" <${process.env.HOST_EMAIL}>`,
    to: email,
    subject,
    text,
  });
};

export default sendEmail;
