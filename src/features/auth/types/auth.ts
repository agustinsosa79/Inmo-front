    import { z } from 'zod';
    
    export const loginSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'La contraseña debería tener al menos 6 caracteres'),
    });

    export type LoginInput = z.infer<typeof loginSchema>;


    export const registerSchema = z.object({
        name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'La contraseña debería tener al menos 6 caracteres'),
    });

    export type RegisterInput = z.infer<typeof registerSchema>;

    export interface authResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }}