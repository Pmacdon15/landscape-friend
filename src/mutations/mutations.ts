import { useMutation } from "@tanstack/react-query";
import { addClient, deleteClient, updateClientPricePer, updateCuttingDay } from "@/actions/clients";
import { markYardServiced } from "@/actions/cuts";
import { sendEmailWithTemplate, sendNewsLetter } from "@/actions/sendEmails";
import { createStripeQuote, markInvoicePaid, markInvoiceVoid, resendInvoice, updateStripeAPIKey } from "@/actions/stripe";
import revalidatePathAction from "@/actions/revalidatePath";
import { assignSnowClearing, toggleSnowClient } from "@/actions/snow";
import { uploadImage } from "@/actions/blobs";


export const useAddClient = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return addClient(formData);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useDeleteClient = () => {
    return useMutation({
        mutationFn: (clientId: number) => {
            return deleteClient(clientId);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};
export const useUploadImage = ({ onSuccess, onError }: { onSuccess?: () => void, onError?: (error: Error) => void }) => {
    return useMutation({
        mutationFn: ({ clientId, formData }: { clientId: number, formData: FormData }) => {
            return uploadImage(clientId, formData);
        },
        onSuccess: () => {
            revalidatePathAction("/lists/client");
            onSuccess?.();
        },
        onError: (error) => {
            onError?.(error);
        }
    });
};

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

export const useUpdateCuttingDay = () => {
    return useMutation({
        mutationFn: ({ clientId, cuttingWeek, cuttingDay }: { clientId: number, cuttingWeek: number, cuttingDay: string }) => {
            return updateCuttingDay(clientId, cuttingWeek, cuttingDay);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useAssignSnowClearing = () => {
    return useMutation({
        mutationFn: ({ clientId, assignedTo }: { clientId: number, assignedTo: string }) => {
            return assignSnowClearing(clientId, assignedTo);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useMarkYardServiced = () => {
    return useMutation({
        mutationFn: ({ clientId, date, snow = false }: { clientId: number, date: Date, snow?: boolean }) => {
            return markYardServiced(clientId, date, snow);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useToggleSnowClient = () => {
    return useMutation({
        mutationFn: ({ clientId }: { clientId: number }) => {
            return toggleSnowClient(clientId);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

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

export const useUpdateStripeAPIKey = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return updateStripeAPIKey({ formData });
        },
        onSuccess: () => {
            revalidatePathAction("/settings/stripe-api-key")
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
}

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