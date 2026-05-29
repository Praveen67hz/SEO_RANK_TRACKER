import cron from "node-cron";
import KeywordTracking from "../models/keywordTracking.js";
import {keywordTrackingService} from "../services/keywordTrackingService.js";


export default function startRankTrackingCron(){
    cron.schedule("0 6 * * * ", async(params) => {
       console.log("Starting daily rank tracking...");
       try {
         const activeTrackings = await KeywordTracking.find({active: true})
         for(const tracking of activeTrackings){
            tracking.status = "checking";
            await tracking.save()

            const result = await keywordTrackingService(tracking)

            // Delay bt checks to avoid rate limiting

            await new Promise((r)=>setTimeout(r, 10000 + Math.random() * 5000))
         }
       } catch (error) {
            console.error("[CRON) Rank tracking cron error:", error.message);
       }
    })
    console.error("Rank tracking cron job scheduled")
}