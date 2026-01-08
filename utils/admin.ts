// Admin configuration
export const ADMIN_EMAILS = [
    "admin@renle.id",
    "aryawarrior98@gmail.com",
    "renle.id.official@gmail.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
}
