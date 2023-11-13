import { setExValue } from "data/redis/redis";

export const sendPasswordResetEmail = async (to) => {
  const generateAuthKey = (length = 20) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const AUTH_KEY = generateAuthKey();
  const link = `${process.env.NEXTAUTH_URL}/setpw?USER_ID=${to}&AUTH_KEY=${AUTH_KEY}`;

  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  const emailData = {
    sender: {
      name: "GNE",
      email: "noreply@gne.ai"
    },
    to: [{
      email: to,
      name: to 
    }],
    subject: "Password Reset Link",
    htmlContent: `
    <div style="background-color: #ffffff; padding: 40px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; border: 1px solid #e4e4e4; padding: 20px; border-radius: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <img src="https://riskweather.io/images/favicon.png" alt="Riskweather Icon" width="60" style="margin-right: 20px;">
            <h2 style="color: #0044cc;">Riskweather</h2>
        </div>
        <p style="font-size: 16px; color: #666666; margin-bottom: 15px; border-bottom: 2px solid #0044cc; padding-bottom: 10px;">We received a request to reset your password. Click the link below:</p>
        <a href="${link}" style="background-color: #0044cc; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Reset Password</a>
    </div>
</div>
    `
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send email:", errorData);
      throw new Error("Failed to send email");
    }
    await setExValue(to,43200,AUTH_KEY)
    console.log(`Password reset email sent to ${to}`);
    return AUTH_KEY;  
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const sendVerificationCode = async (to) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  const emailData = {
    sender: {
      name: "GNE",
      email: "noreply@gne.ai"
    },
    to: [{
      email: to,
      name: to 
    }],
    subject: "Your Verification Code",
    htmlContent:`
    <div style="background-color: #ffffff; padding: 40px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; border: 1px solid #e4e4e4; padding: 20px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <img src="https://riskweather.io/images/favicon.png" alt="Riskweather Icon" width="60" style="margin-right: 20px;">
                <h2 style="color: #0044cc;">Riskweather</h2>
            </div>
            <p style="font-size: 16px; color: #666666; margin-bottom: 15px; border-bottom: 2px solid #0044cc; padding-bottom: 10px;">Your email verification code is:</p>
            <div style="background-color: #f4f4f4; color: #0044cc; padding: 10px 15px; border-radius: 5px; display: inline-block; margin-top: 20px; font-size: 20px; user-select: text;">${verificationCode}</div>
        </div>
    </div>
    `
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send email:", errorData);
      throw new Error("Failed to send email");
    }

    console.log(`Email sent to ${to}`);
    return verificationCode;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
