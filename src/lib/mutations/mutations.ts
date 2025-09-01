import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient, deleteClient, updateClientPricePer, updateCuttingDay, deleteSiteMap } from "@/lib/actions/clients-action";
import { markYardServiced } from "@/lib/actions/cuts-action";
import { sendEmailWithTemplate, sendNewsLetter } from "@/lib/actions/sendEmails-action";
import { createStripeQuote, markInvoicePaid, markInvoiceVoid, markQuote, resendInvoice, updateStripeAPIKey } from "@/lib/actions/stripe-action";
import revalidatePathAction from "@/lib/actions/revalidatePath-action";
import { assignSnowClearing, toggleSnowClient } from "@/lib/actions/snow-action";
import { uploadDrawing, uploadImage } from "@/lib/actions/blobs-action";
import { MarkQuoteProps } from "@/types/types-stripe";

//MARK: Add client
export const useAddClient = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return addClient(formData);
        },
        onSuccess: () => { revalidatePathAction("/lists/client") },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

//MARK: Delete client
export const useDeleteClient = () => {
    return useMutation({
        mutationFn: (clientId: number) => {
            return deleteClient(clientId);
        },
        onSuccess: () => { revalidatePathAction("/lists/client") },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

//MARK:Upload Image for site map
export const useUploadImage = ({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: Error) => void }) => {
    return useMutation({
        mutationFn: ({ clientId, formData }: { clientId: number, formData: FormData }) => {
            return uploadImage(clientId, formData);
        },
        onSuccess: () => {
            // revalidatePathAction("/lists/client");
            onSuccess?.();
        },
        onError: (error) => {
            onError?.(error);
        }
    });
};
//MARK:Delete site map

export const useDeleteSiteMap = () => {
    return useMutation({
        mutationFn: ({ clientId, siteMapId }: { clientId: number, siteMapId: number }) => {
            return deleteSiteMap(clientId, siteMapId);
        },
        onSuccess: () => {
            revalidatePathAction("/lists/client");
            revalidatePathAction("/lists/clearing");
            revalidatePathAction("/lists/cutting");
        },
        onError: () => {
        }
    });
};
//MARK:Upload drawing site map
// export const useUploadDrawing = ({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: Error) => void }) => {
export const useUploadDrawing = () => {
    return useMutation({
        mutationFn: ({ file, clientId }: { file: Blob, clientId: number }) => {
            return uploadDrawing(file, clientId);
        },
        onSuccess: () => {
            // revalidatePathAction("/lists/client");
            // onSuccess?.();
        },
        onError: () => {
            // onError?.();
        }
    });
};

//MARK:Update client price per cut
export const useUpdateClientPricePer = () => {
    return useMutation({
        mutationFn: ({ clientId, pricePerCut, snow = false }: { clientId: number, pricePerCut: number, snow: boolean }) => {
            return updateClientPricePer(clientId, pricePerCut, snow);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

//MARK:Update cutting day
export const useUpdateCuttingDay = () => {
    return useMutation({
        mutationFn: ({ clientId, cuttingWeek, cuttingDay }: { clientId: number, cuttingWeek: number, cuttingDay: string }) => {
            return updateCuttingDay(clientId, cuttingWeek, cuttingDay);
        },
        onSuccess: () => { revalidatePathAction("/lists/client") },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

//MARK: Assign snow clearing
export const useAssignSnowClearing = () => {
    return useMutation({
        mutationFn: ({ clientId, assignedTo }: { clientId: number, assignedTo: string }) => {
            return assignSnowClearing(clientId, assignedTo);
        },
        onSuccess: () => { revalidatePathAction("/lists/client") },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};
//MARK:Mark yard serviced
export const useMarkYardServiced = () => {
    return useMutation({
        mutationFn: ({ clientId, date, snow = false, image }: { clientId: number, date: Date, snow?: boolean, image:File }) => {
            return markYardServiced(clientId, date, snow, image);
        },
        onSuccess: () => { revalidatePathAction("/lists/clearing"); revalidatePathAction("/lists/cutting") },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};
//MARK:Toggle snow client
export const useToggleSnowClient = () => {
    return useMutation({
        mutationFn: ({ clientId }: { clientId: number }) => {
            return toggleSnowClient(clientId);
        },
        onSuccess: () => { revalidatePathAction("/lists/client") },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

//MARK: Send email with template
export const useSendEmailWithTemplate = ({
    clientEmail,
    onSuccess,
}: {
    clientEmail: string;
    onSuccess?: () => void;
}) => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return sendEmailWithTemplate(formData, clientEmail);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        },
        onSuccess: () => {
            onSuccess?.();
        },
    });
};

//MARK:Send news letter
export const useSendNewsLetter = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return sendNewsLetter(formData);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

//MARK:Create stripe quote
export const useCreateStripeQuote = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await createStripeQuote(formData);
            if (!result.success) {
                throw new Error("Failed to create Stripe quote");
            }
            return result;
        },
    });
};

//MARK:Update stripe api key
export const useUpdateStripeAPIKey = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => {
            return updateStripeAPIKey({ formData });
        },
        onSuccess: () => {
            revalidatePathAction("/settings/stripe-api-key")
            queryClient.invalidateQueries({ queryKey: ['hasStripeApiKey'] });

        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
}

//MARK: Resend invoice
export const useResendInvoice = () => {
    return useMutation({
        mutationFn: async (invoiceId: string) => {
            return resendInvoice(invoiceId);
        },
        onSuccess: () => {
            revalidatePathAction("/billing/manage/invoices")
        },
    });
};

//MARK:Mark invoice paid
export const useMarkInvoicePaid = () => {
    return useMutation({
        mutationFn: async (invoiceId: string) => {
            return markInvoicePaid(invoiceId);
        },
        onSuccess: () => {
            revalidatePathAction("/billing/manage/invoices")
        },
    });
};
//MARK: Mark invoice void
export const useMarkInvoiceVoid = () => {
    return useMutation({
        mutationFn: async (invoiceId: string) => {
            return markInvoiceVoid(invoiceId);
        },
        onSuccess: () => {
            revalidatePathAction("/billing/manage/invoices")
        },
    });
};

//MARK: Accecpt quote
export const useMarkQuote = () => {
    return useMutation({
        mutationFn: async ({ action, quoteId }: MarkQuoteProps) => {
            return markQuote({ action, quoteId });
        },
        onSuccess: () => {
            revalidatePathAction("/billing/manage/invoices")
        },
    });
};