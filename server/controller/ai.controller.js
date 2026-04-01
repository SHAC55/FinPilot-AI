import { runGemini } from "../utils/gemini.js";

export const analyzeExpenses = async (req, res) => {
  try {
    const { expenses } = req.body;

    const prompt = `
You are a Senior Certified Financial Planner (CFP) specializing in personal expense analysis and Indian household budgeting.

User's Monthly Expenses:
${JSON.stringify(expenses)}

Analyze the spending pattern and respond ONLY in this exact JSON — no extra text, no markdown, no code fences:

{
  "overview": {
    "totalSpent": "₹ amount",
    "topCategory": "category name",
    "wastedAmount": "₹ estimated wasteful spend",
    "savingsOpportunity": "₹ amount they could realistically save"
  },
  "categoryBreakdown": [
    {
      "category": "category name",
      "amount": "₹ amount",
      "percentOfTotal": number,
      "status": "Healthy | Moderate | Overspending | Critical",
      "benchmark": "industry standard % for this category e.g. 30% of income"
    }
  ],
  "overspendingAreas": [
    {
      "category": "category name",
      "issue": "One sharp sentence explaining the problem",
      "impact": "₹ monthly loss",
      "fix": "One specific actionable fix"
    }
  ],
  "savingTips": [
    {
      "icon": "emoji",
      "title": "Short tip title (3-5 words)",
      "tip": "Specific actionable advice with real Indian context (apps, services, habits)",
      "monthlySaving": "₹ estimated saving"
    },
    {
      "icon": "emoji",
      "title": "Short tip title",
      "tip": "Specific actionable advice",
      "monthlySaving": "₹ estimated saving"
    },
    {
      "icon": "emoji",
      "title": "Short tip title",
      "tip": "Specific actionable advice",
      "monthlySaving": "₹ estimated saving"
    }
  ],
  "financialAdvice": {
    "summary": "One powerful sentence about their overall financial health",
    "rule": "One specific rule they should follow e.g. 50/30/20 rule breakdown for their income",
    "priority": "The single most important action they must take this month"
  },
  "scorecard": {
    "score": number,
    "label": "Poor | Fair | Good | Excellent",
    "note": "One line explaining the score"
  }
}

Rules:
- RAW JSON only — no backticks, no markdown, no preamble
- All ₹ values in Indian number format (e.g. ₹1,20,000)
- percentOfTotal must be a plain integer 0-100
- score must be integer 0-100
- status must be exactly one of: Healthy, Moderate, Overspending, Critical
- label must be exactly one of: Poor, Fair, Good, Excellent
- Reference real Indian apps/services where relevant (Zepto, Swiggy, CRED, Groww, etc.)
`;

    const result = await runGemini(prompt);

    res.json({ analysis: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const analyzeGoal = async (req, res) => {
  try {
    // console.log(" ANALYZE GOAL REQUEST BODY:", process.env.GEMINI_API_KEY); // DEBUG LOG
    const { currentAmount, goalAmount, deadline } = req.body;

    const prompt = `
You are a Senior Certified Financial Planner (CFP) with 15+ years of experience in Indian personal finance, tax planning, and wealth management.

User's Financial Goal:
- Current Savings: ₹${currentAmount}
- Target Amount:   ₹${goalAmount}
- Deadline:        ${deadline}

Perform a thorough financial gap analysis and respond ONLY in this exact JSON — no extra text, no markdown, no code fences:

{
  "analysis": {
    "gap": "₹ amount in Indian format",
    "monthsLeft": number,
    "feasibility": "Easy | Moderate | Challenging | Aggressive",
    "completionPercent": number
  },
  "savingPlan": {
    "monthly": "₹ amount",
    "weekly":  "₹ amount",
    "daily":   "₹ amount"
  },
  "summary": "One sharp, motivating sentence referencing their specific numbers",
  "professionalTips": [
    {
      "category": "Tax Planning",
      "icon": "🧾",
      "title": "Short tip headline (3-5 words)",
      "tip": "Specific, actionable Indian finance advice referencing real instruments like PPF, ELSS, NPS, SIPs, FDs, etc."
    },
    {
      "category": "Investment",
      "icon": "📈",
      "title": "Short tip headline",
      "tip": "Specific advice mentioning real instruments, realistic return rates (e.g. 12% CAGR via equity MF)"
    },
    {
      "category": "Budgeting",
      "icon": "📊",
      "title": "Short tip headline",
      "tip": "Practical budgeting advice using the 50/30/20 rule or zero-based budgeting tailored to their gap"
    },
    {
      "category": "Emergency Buffer",
      "icon": "🛡️",
      "title": "Short tip headline",
      "tip": "Advice on maintaining 3-6 month expense buffer in liquid funds while pursuing this goal"
    }
  ],
  "instruments": [
    { "name": "SIP in Equity MF", "expectedReturn": "10-12% p.a.", "risk": "Medium", "suitable": true },
    { "name": "PPF",              "expectedReturn": "7.1% p.a.",   "risk": "Low",    "suitable": true },
    { "name": "Fixed Deposit",    "expectedReturn": "6.5-7% p.a.", "risk": "Low",    "suitable": true }
  ],
  "riskFlag": null
}

Rules:
- RAW JSON only — no backticks, no markdown, no preamble
- Indian number formatting for all ₹ values (e.g. ₹1,20,000)
- completionPercent = integer 0-100
- monthsLeft = plain integer
- riskFlag = null if achievable, else one specific warning string
- instruments[].suitable = true if recommended for this timeline/gap
- Tips must reference REAL Indian financial products and regulations
`;

    const result = await runGemini(prompt);

    res.json({ analysis: result });
  } catch (error) {
    console.error(" CONTROLLER ERROR:", error);

    res.json({
      analysis: " Something went wrong",
    });
  }
};
