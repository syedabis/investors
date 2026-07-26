export interface User {
  name: string;
  passwordHash: string;
}

// Passwords: admin → admin123, investor → investor123 (bcrypt $2b$12)
export const USERS: Record<string, User> = {
  admin: {
    name: "Admin",
    passwordHash: "$2b$12$bno121WMzOisf4yplokRuuRpQflkkyOW6KpYWaN5uYZ/NyyWoPDBG",
  },
  investor: {
    name: "Investor",
    passwordHash: "$2b$12$wJiREXzC5iZ0l3ESng06Leu0NlilIZtFhmpnAdJMeNstsJYvjZl1m",
  },
};
