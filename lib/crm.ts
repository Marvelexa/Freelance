import dotenv from "dotenv";
dotenv.config();

export interface CRMMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a WhatsApp message via the WACRM REST API.
 * Supports both text messages and media (video) messages.
 */
export async function sendWhatsAppViaCRM(
  phone: string,
  message: string,
  mediaUrl?: string,
  customApiKey?: string,
  customApiUrl?: string
): Promise<CRMMessageResult> {
  const apiUrl = customApiUrl || process.env.CRM_API_URL || "http://localhost:3000/api/v1";
  const apiKey = customApiKey || process.env.CRM_API_KEY;

  if (!apiKey) {
    console.error("[CRM API Client] Error: CRM API Key is not configured.");
    return { success: false, error: "CRM API Key is not configured" };
  }

  // Format the phone number (E.164 format)
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone; // Fallback to Indian prefix if 10-digit
  }
  if (!cleanPhone.startsWith("+")) {
    cleanPhone = "+" + cleanPhone;
  }

  try {
    const isVideo = mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") || mediaUrl.includes("/videos/"));
    
    // Prepare endpoint and payload
    const endpoint = `${apiUrl}/messages`;
    
    // If mediaUrl is relative (e.g. /videos/abc.webm), prefix it with our app's public URL
    let absoluteMediaUrl = mediaUrl;
    if (mediaUrl && (mediaUrl.startsWith("/") || !mediaUrl.startsWith("http"))) {
      const appUrl = process.env.APP_URL || "http://localhost:3000"; // outreach project port
      absoluteMediaUrl = `${appUrl.replace(/\/$/, "")}/${mediaUrl.replace(/^\//, "")}`;
    }

    const payload = isVideo ? {
      phone: cleanPhone,
      message_type: "video",
      media_url: absoluteMediaUrl,
      content_text: message // Caption for the video
    } : {
      phone: cleanPhone,
      message_type: "text",
      content_text: message
    };

    console.log(`[CRM API Client] Sending message to ${cleanPhone} via CRM API at ${endpoint}...`);
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const resJson = await response.json() as any;

    if (!response.ok) {
      const errorMsg = resJson.error?.message || `HTTP ${response.status} Error`;
      console.error(`[CRM API Client] Failed to send message:`, errorMsg);
      return { success: false, error: errorMsg };
    }

    console.log(`[CRM API Client] Message sent successfully! Msg ID: ${resJson.data?.messageId || resJson.data?.id}`);
    return {
      success: true,
      messageId: resJson.data?.messageId || resJson.data?.id
    };

  } catch (err: any) {
    console.error(`[CRM API Client] Network or Server error:`, err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}
