export const GOOGLE_SCOPES_MAP: Record<string, string> = {
    // Gmail
    "gmail_list_messages": "https://www.googleapis.com/auth/gmail.readonly",
    "gmail_get_message": "https://www.googleapis.com/auth/gmail.readonly",
    "gmail_get_thread": "https://www.googleapis.com/auth/gmail.readonly",
    "gmail_read_messages": "https://www.googleapis.com/auth/gmail.readonly",
    "gmail_send_message": "https://www.googleapis.com/auth/gmail.send",
    "gmail_create_draft": "https://www.googleapis.com/auth/gmail.compose",

    // Calendar
    "google_calendar_list_events": "https://www.googleapis.com/auth/calendar.readonly",
    "google_calendar_get_event": "https://www.googleapis.com/auth/calendar.readonly",
    "google_calendar_create_event": "https://www.googleapis.com/auth/calendar",

    // Sheets
    "google_sheets_list_spreadsheets": "https://www.googleapis.com/auth/spreadsheets.readonly",
    "google_sheets_create_spreadsheet": "https://www.googleapis.com/auth/spreadsheets",
    "google_sheets_get_values": "https://www.googleapis.com/auth/spreadsheets.readonly",
    "google_sheets_update_values": "https://www.googleapis.com/auth/spreadsheets",

    // Docs
    "google_docs_list_documents": "https://www.googleapis.com/auth/documents.readonly",
    "google_docs_get_document": "https://www.googleapis.com/auth/documents.readonly",
    "google_docs_create_document": "https://www.googleapis.com/auth/documents",
    "google_docs_append_text": "https://www.googleapis.com/auth/documents",
    "google_docs_update_text": "https://www.googleapis.com/auth/documents",
    "google_docs_delete_document": "https://www.googleapis.com/auth/documents",

    // Drive (General fallback often added by Google, but good to have if needed)
    "google_drive_file": "https://www.googleapis.com/auth/drive.file"
};

export function getScopesForTools(tools: string[]): string[] {
    if (!tools || tools.length === 0) return [];

    const scopes = tools
        .map(tool => GOOGLE_SCOPES_MAP[tool])
        .filter(scope => !!scope); // Remove undefined

    // Always include UserInfo/Email if needed, but usually handled by default params
    // Return unique scopes
    return [...new Set(scopes)];
}
