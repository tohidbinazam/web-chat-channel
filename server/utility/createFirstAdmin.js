import Admin from '../model/adminModel.js';
import sendEmail from './sendEmail.js';

const createFirstAdmin = async () => {
  const adminCount = await Admin.countDocuments();

  if (adminCount === 0) {
    const data = {
      first_nm: 'Tohid',
      email: 'tohidbinazamsunny1@gmail.com',
      password: 'qwer',
      mobile: '01994249463',
      role: '662a5da2e68c7cef4cda8819',
    };

    const admin = await Admin.create(data);

    await sendEmail(
      admin.email,
      'Account created successfully',
      `Email: ${admin.email},
       Password: ${data.password}
       Role: ${admin.role.name}`
    );

    console.log('First Admin created successfully');
  }
};

export default createFirstAdmin;
