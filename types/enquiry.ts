export interface EnquiryInput {
  name: string;
  phone: string;
  email?: string;
  message: string;
  visitDate: string; // YYYY-MM-DD
  propertySlug: string;
  company?: string; // Honeypot field (must be empty)
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  visitDate: string;
  propertySlug: string;
  ipHash: string;
  createdAt: string; // ISO 8601
}

export interface EnquirySuccessResponse {
  id: string;
  message?: string;
}
