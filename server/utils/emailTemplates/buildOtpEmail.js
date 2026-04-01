export const buildOtpEmail = ({ username, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    
    <div style="max-width:500px; margin:auto; background:white; border-radius:12px; padding:30px; text-align:center;">
      
      <h2 style="color:#111;">🔐 Verify Your Account</h2>
      
      <p style="color:#555;">Hi ${username || "User"},</p>
      
      <p style="color:#555;">
        Use the OTP below to verify your FinPilot AI account:
      </p>

      <div style="
        font-size:28px;
        font-weight:bold;
        letter-spacing:8px;
        background:#f1f5f9;
        padding:15px;
        border-radius:10px;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="color:#777; font-size:14px;">
        This OTP will expire in <strong>5 minutes</strong>.
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px; color:#999;">
        If you didn’t request this, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#999;">
        — FinPilot AI 
      </p>

    </div>
  </div>
  `;
};