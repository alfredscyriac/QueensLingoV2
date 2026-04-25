export type UrgencyLevel = 'low' | 'medium' | 'high'; 

export interface AnalysisResult {
    document_type: string;
    translated_explanation: string;
    next_steps: string[]; 
    urgency: UrgencyLevel; 
    resource_keywords: string[]; 
}

export interface ResourceOrg {
    name: string; 
    address: string; 
    rating?: number; 
    place_id: string; 
    maps_url: string; 
    photo_url: string | null;  
}