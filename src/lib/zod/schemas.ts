import z from 'zod'

export const schemaAddClient = z.object({
    full_name: z.string(),
    email_address: z.email(),
    address: z.string(),
})

export const schemaDeleteClient = z.object({
    client_id: z.number(),
})

export const schemaSendNewsLetter = z.object({
    title: z.string(),
    message: z.string(),
})
