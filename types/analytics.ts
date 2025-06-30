// Centralized type definitions untuk Google Analytics
export interface GtagConfigExtended {
  page_path?: string
  page_title?: string
  send_page_view?: boolean
  anonymize_ip?: boolean
  allow_ad_personalization_signals?: boolean
  cookie_flags?: string
  custom_map?: Record<string, unknown>
  campaign_id?: string
  campaign_name?: string
  campaign_source?: string
  campaign_medium?: string
  campaign_term?: string
  campaign_content?: string
}

export interface GtagEventExtended {
  event_category?: string
  event_label?: string
  value?: number
  custom_parameter?: string
  user_id?: string
  session_id?: string
}

export interface GtagConsentConfig {
  analytics_storage?: "granted" | "denied"
  ad_storage?: "granted" | "denied"
  functionality_storage?: "granted" | "denied"
  personalization_storage?: "granted" | "denied"
  security_storage?: "granted" | "denied"
  ad_user_data?: "granted" | "denied"
  ad_personalization?: "granted" | "denied"
}

// Tambahkan interface untuk Google Analytics Event standar
export interface GtagEvent {
  action?: string
  event_category?: string
  event_label?: string
  value?: number
  send_to?: string
  [key: string]: unknown
}

// Union type untuk semua config - SERTAKAN GtagEvent
export type GtagConfig = GtagConfigExtended | GtagEventExtended | GtagConsentConfig | GtagEvent

// Global window interface extension - SATU-SATUNYA DEKLARASI
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, targetId: string, config?: GtagConfig) => void
  }
}