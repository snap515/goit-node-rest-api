export const emailText = `<div style="font-family: Arial, sans-serif;">
      <h2 style="color: #007bff;">Welcome to Our App!</h2>
      <p>
        Hello ${name},<br>
        Thank you for registering with us!<br>
        To complete your registration, please click the link below to verify your email address:
      </p>
      <p>
        <a href="${BASE_URL}/api/auth/verify/${verificationCode}" style="color: #28a745; text-decoration: none;">Click here to verify</a>
      </p>
      <p>
        If you did not sign up for our service, you can safely ignore this email.
      </p>
      <p>
        Best regards,<br>
        The Our App Team
      </p>
    </div>`;
