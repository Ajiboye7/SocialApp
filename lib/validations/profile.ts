import * as z from 'zod'


export const profileValidation = z.object({
    profile_photo : z.url().nonempty(),
    name: z
    .string()
    .min(3, {message:'Minimum 3 characters.'})
    .max(30, {message: 'Maximum of 30 characters'}),

    username: z
    .string()
    .min(3, {message:'Minimum 3 characters.'})
    .max(30, {message: 'Maximum of 30 characters'}),

    bio: z 
    .string()
    .min(3, {message:'Minimum 3 characters.'})
    .max(1000, {message: 'Maximum of 1000 characters'}),
})