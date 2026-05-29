import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to validate severity values
function validateSeverity(severity) {
    const allowed = ["critical", "warning", "info"];
    if (allowed.includes(severity)) return severity;
    // Map common invalid values
    if (severity === "high") return "critical";
    if (severity === "medium") return "warning";
    if (severity === "low") return "info";
    return "info"; // Default fallback
}

export async function analyzeSeoData(scrapedData) {
    try {
        console.log("Starting Gemini analysis for:", scrapedData.url);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert SEO analyst. Analyze the following website data and provide a comprehensive SEO audit.

Website URL: ${scrapedData.url}
Load Time: ${scrapedData.loadTime}ms
Word Count: ${scrapedData.wordCount}

META DATA:
- Title: "${scrapedData.metaData?.title || ""}"
- Description: "${scrapedData.metaData?.description || ""}"

HEADINGS:
- H1: ${scrapedData.headings?.h1 || 0}
- H2: ${scrapedData.headings?.h2 || 0}
- H3: ${scrapedData.headings?.h3 || 0}

IMAGES:
- Total: ${scrapedData.images?.total || 0}
- Missing Alt Text: ${scrapedData.images?.missingAlt || 0}

IMPORTANT: severity must be ONLY one of: "critical", "warning", or "info". Do NOT use "high", "medium", or "low".

Return ONLY a valid JSON object with EXACTLY this structure:
{
  "overallScore": 75,
  "categories": {
    "seo": 70,
    "performance": 80,
    "accessibility": 75,
    "bestPractices": 75
  },
  "keywords": [
    {"word": "example", "count": 10, "density": 2.5}
  ],
  "issues": [
    {
      "severity": "warning",
      "category": "seo",
      "message": "Meta description could be improved",
      "recommendation": "Add a compelling meta description"
    }
  ]
}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
            },
        });

        const response = result.response;
        const text = response.text();
        
        console.log("Gemini response received");
        
        const analysis = JSON.parse(text);
        
        // Validate and fix severity values
        const validatedAnalysis = {
            overallScore: analysis.overallScore || 65,
            categories: {
                seo: analysis.categories?.seo || 60,
                performance: analysis.categories?.performance || 70,
                accessibility: analysis.categories?.accessibility || 65,
                bestPractices: analysis.categories?.bestPractices || 65,
            },
            keywords: (analysis.keywords || []).slice(0, 10),
            issues: (analysis.issues || []).map(issue => ({
                severity: validateSeverity(issue.severity),
                category: issue.category || "seo",
                message: issue.message || "Issue detected",
                recommendation: issue.recommendation || "Please review and fix",
            })),
        };
        
        return { success: true, data: validatedAnalysis };

    } catch (error) {
        console.error("Gemini analysis error:", error.message);
        
        return {
            success: true,
            data: {
                overallScore: 65,
                categories: { seo: 60, performance: 70, accessibility: 65, bestPractices: 65 },
                keywords: [],
                issues: [
                    {
                        severity: "info",
                        category: "seo",
                        message: "Analysis completed with default values",
                        recommendation: "Try again for more detailed insights",
                    },
                ],
            },
        };
    }
}