// API service for licensing configuration

// API configuration for Story API
export const STORY_API_CONFIG = {
  apiKey: "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
  chain: "story-aeneid"
};

// Interface for license terms response
interface LicenseTermsResponse {
  data?: Array<{
    licenseTermsId: number;
    [key: string]: any;
  }>;
  error?: string;
}

/**
 * Fetches license terms IDs for a given IP ID
 * @param ipId The IP ID to fetch license terms for
 * @returns Array of license terms options or null if error
 */
export async function fetchLicenseTermsIds(ipId: string): Promise<{ 
  options: Array<{ value: string; label: string; }>;
  error?: string;
}> {
  if (!ipId || ipId === '0x1234...') {
    return { options: [], error: "Invalid IP ID" };
  }
  
  try {
    const options = {
      method: 'GET', 
      headers: {
        'X-Api-Key': STORY_API_CONFIG.apiKey, 
        'X-Chain': STORY_API_CONFIG.chain
      }
    };
    
    const response = await fetch(`https://api.storyapis.com/api/v3/licenses/ip/terms/${ipId}`, options);
    const data: LicenseTermsResponse = await response.json();
    
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      const options = data.data.map(term => ({
        value: term.licenseTermsId.toString(),
        label: `Terms ID: ${term.licenseTermsId}`
      }));
      
      return { options };
    } else {
      return { options: [], error: "No license terms found for this IP ID" };
    }
  } catch (error) {
    console.error("Error fetching license terms:", error);
    return { 
      options: [], 
      error: "Error fetching license terms. Please check the IP ID." 
    };
  }
}
