import { toast } from 'react-toastify';

export const adminDateOfBirthValidation = (birth) => {
  if (
    birth &&
    new Date(birth) > new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000)
  ) {
    toast.error('Admin must be at least 15 years old');
    return false;
  }
  return true;
};
