export const validation = {
  phone: (phone: string): boolean => {
    // Malawi phone format: 099X XXX XXX or 088X XXX XXX
    const cleaned = phone.replace(/\s/g, '');
    return /^(265)?(0?)(88|99|77)\d{7}$/.test(cleaned);
  },

  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  },

  message: (message: string): boolean => {
    return message.trim().length >= 10 && message.trim().length <= 1000;
  },

  sanitize: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }
};