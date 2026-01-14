
import { GoogleGenAI } from "@google/genai";
import { Account, Transaction } from "../types";

export const getFinancialAdvice = async (accounts: Account[], transactions: Transaction[]) => {
  console.log("DEBUG: API_KEY present?", !!process.env.API_KEY);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const accountSummary = accounts.map(a => `${a.name} (${a.type}): ${a.balance}`).join('\n');
  const recentTransactions = transactions.slice(-5).map(t => `${t.date}: ${t.description}`).join('\n');

  const prompt = `
    As a professional financial advisor, analyze these accounts:
    ${accountSummary}
    
    Recent activities:
    ${recentTransactions}
    
    Provide a 3-sentence summary of the business health and one actionable advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a concise financial consultant for small businesses. Focus on liquidity, profit, and debt management."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate financial advice at this time. Please check your internet connection.";
  }
};
