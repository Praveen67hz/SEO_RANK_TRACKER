import { rankTracker } from "./rankTrackerService.js";

export async function keywordTrackingService(tracking) {
    try {
        console.log("Starting tracking for:", tracking.keyword);
        
        const result = await rankTracker(tracking.keyword, tracking.domain);
        
        console.log("Result received:", result);
        
        if (result.success) {
            const prev = tracking.currentPosition;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            tracking.currentPosition = result.data.position;
            tracking.currentPage = result.data.page;
            
            // FIX: Add ALL required fields including 'url'
            tracking.competitors = result.data.competitors.map((domain, index) => ({
                position: index + 1,
                url: `https://${domain}`,  // ← ADD THIS
                domain: domain,
                title: `${domain} - ${tracking.keyword}`,
                snippet: `Ranked #${index + 1} for "${tracking.keyword}"`
            }));
            
            tracking.lastChecked = new Date();
            tracking.status = "completed";
            
            tracking.positionChange = prev && result.data.position ? prev - result.data.position : 0;
            if (result.data.position && (!tracking.bestPosition || result.data.position < tracking.bestPosition)) {
                tracking.bestPosition = result.data.position;
            }
            
            const historyEntry = {
                date: today,
                position: result.data.position,
                page: result.data.page,
                title: result.data.title || "",
                snippet: result.data.snippet || "",
            };
            
            const existingIndex = tracking.rankHistory.findIndex((h) => {
                if (!h.date) return false;
                return new Date(h.date).toDateString() === today.toDateString();
            });
            
            if (existingIndex >= 0) {
                tracking.rankHistory[existingIndex] = historyEntry;
            } else {
                tracking.rankHistory.push(historyEntry);
            }
            
            await tracking.save();
            console.log("✅ Tracking completed for:", tracking.keyword);
            return result;
        } else {
            tracking.status = "failed";
            await tracking.save();
            return { success: false, error: result.error };
        }
        
    } catch (err) {
        console.error("Rank update error:", err.message);
        tracking.status = "failed";
        await tracking.save().catch(() => {});
        return { success: false, error: err.message };
    }
}