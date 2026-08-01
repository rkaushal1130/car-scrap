export interface InquiryFormState {
  fullName: string;
  phoneNum: string;
  emailAddr: string;
  message: string;
}

export function validateInquiryForm(form: InquiryFormState): { isValid: boolean; errors: Partial<InquiryFormState> } {
  const errors: Partial<InquiryFormState> = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  }

  if (!form.phoneNum.trim() || !/^\+?[0-9\s\-]{10,15}$/.test(form.phoneNum.trim())) {
    errors.phoneNum = 'Valid phone number is required';
  }

  if (!form.emailAddr.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddr.trim())) {
    errors.emailAddr = 'Valid email address is required';
  }

  if (!form.message.trim() || form.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
