import { fetchInvoices } from "@/DAL/dal";
import ManageInvoiceButton from "@/components/ui/buttons/manage-invoice-button";
import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { MobileCardView, TableBody, TableHead } from "@/components/ui/manage-invoices/manage-invoices-content";
import { PaginationTabs } from "@/components/ui/pagination/pagination-tabs";
import { parseClientListParams } from "@/lib/params";
import { SearchParams, StripeInvoice } from "@/types/types";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const { searchTermStatus, page } = parseClientListParams(params);
    const { invoices, totalPages } = await fetchInvoices(searchTermStatus, page)

    return (
        <FormContainer>
            <FormHeader text={"Manage Invoices"} />
            <SearchForm variant="invoices" />
            <PaginationTabs path={"/billing/manage/invoices"} page={page} totalPages={totalPages} fullWidth />
            <table className="min-w-full bg-white">
                <TableHead />
                <TableBody invoices={invoices} />
            </table>
            <MobileCardView invoices={invoices} />
            <PaginationTabs path={"/billing/manage/invoices"} page={page} totalPages={totalPages} fullWidth />
        </FormContainer>
    );
}
