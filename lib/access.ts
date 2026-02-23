import { Access, PayloadRequest } from 'payload';

// General Access type — can return Where queries (for read/update/delete)
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin';

// Strict boolean-only version — required for the `admin` panel access field
export const isAdminAccess = ({ req }: { req: PayloadRequest }): boolean => req.user?.role === 'admin';
