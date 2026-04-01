export const buildSplitBillEmail = ({
  name,
  billTitle,
  totalAmount,
  amount,
  paidBy,
  participants = [],
  splits = [],
  date,
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <h2 style="color:#4f46e5; margin-bottom:10px;">💸 SplitBill Update</h2>

      <p style="font-size:16px;">Hi <strong>${name}</strong>,</p>

      <p style="color:#555;">
        A bill has been created/updated. Here are the details:
      </p>

      <!-- BILL DETAILS -->
      <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:15px 0;">
        <p><strong>🧾 Bill:</strong> ${billTitle}</p>
        <p><strong>💰 Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>👤 Paid By:</strong> ${paidBy}</p>
        <p><strong>📅 Date:</strong> ${date || new Date().toLocaleDateString()}</p>
      </div>

      <!-- YOUR SHARE -->
      <div style="background:#eef2ff; padding:15px; border-radius:8px; margin:15px 0;">
        <p style="font-size:16px;">
          <strong>👉 Your Share:</strong> 
          <span style="color:#dc2626; font-weight:bold;">₹${amount}</span>
        </p>
      </div>

      <!-- PARTICIPANT TABLE -->
      ${
        splits.length
          ? `
        <div style="margin-top:15px;">
          <p><strong>👥 Participants Breakdown:</strong></p>

          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px; text-align:left;">Name</th>
                <th style="padding:8px; text-align:left;">Paid</th>
                <th style="padding:8px; text-align:left;">Owes</th>
              </tr>
            </thead>
            <tbody>
              ${splits
                .map(
                  (s) => `
                <tr>
                  <td style="padding:8px; border-top:1px solid #eee;">
                    ${s.name}
                  </td>
                  <td style="padding:8px; border-top:1px solid #eee; color:#16a34a;">
                    ₹${s.amountPaid}
                  </td>
                  <td style="padding:8px; border-top:1px solid #eee; color:#dc2626;">
                    ₹${s.amountOwed}
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
          : ""
      }

      

      <!-- CTA -->
      <div style="text-align:center; margin-top:25px;">
        <a href="#" 
           style="background:#4f46e5; color:white; padding:10px 18px; border-radius:6px; text-decoration:none; font-weight:500;">
          View & Manage Bill
        </a>
      </div>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px; color:gray; text-align:center;">
        FinPilot AI • Smart Expense Management 🚀
      </p>

    </div>
  </div>
  `;
};
