import z from 'zod'

export const schemaAddClient = z.object({
    full_name: z.string(),
    phone_number: z.number(),
    email_address: z.email(),
    address: z.string(),
    stripe_customer_id: z.string().optional(),
    organization_id: z.string(),
})

export const schemaUpdatePricePerCut = z.object({
    clientId: z.number(),
    pricePerCut: z.number(),
    snow: z.boolean()
})

export const schemaDeleteClient = z.object({
    client_id: z.number(),
})

export const schemaDeleteSiteMap = z.object({
    client_id: z.number(),
    siteMap_id: z.number(),
})

export const schemaSendEmail = z.object({
    title: z.string(),
    message: z.string(),
    sender: z.email(),
    senderName: z.string(),
    replyTo: z.email().optional(),
})

export const schemaUpdateCuttingDay = z.object({
    clientId: z.number(),
    cuttingWeek: z.number(),
    updatedDay: z.string(),
})

export const schemaMarkYardCut = z.object({
    clientId: z.number(),
    date: z.date()
})

export const schemaAssignSnowClearing = z.object({
    clientId: z.number(),
    assignedTo: z.string()
})


export const schemaToggleSnowClient = z.object({
    clientId: z.number()
})

export const schemaUpdateAPI = z.object({
    APIKey: z.string()
})

export const materialSchema = z.object({
    materialType: z.string().optional().or(z.literal('')),
    materialCostPerUnit: z.number().optional().default(0),
    materialUnits: z.number().optional().default(0),
});

export const schemaCreateQuote = z.object({
    clientName: z.string(),
    clientEmail: z.string(),
    phone_number: z.string(),
    address: z.string(),
    labourCostPerUnit: z.number(),
    labourUnits: z.number(),
    materials: z.array(materialSchema),
    organization_id: z.string(),
});

export const AddClientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    notes: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
});
export const MAX_FILE_SIZE = 500000;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const ImageSchema = z.object({
    image: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
        ),
});