import SearchForm from "@/components/ui/search/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { CardView } from "@/components/ui/manage/invoices/manage-invoices-card-view";
import { PaginationTabs } from "@/components/ui/pagination/pagination-tabs";
import { fetchInvoices } from "@/lib/dal/stripe-dal";
import { parseClientListParams } from "@/lib/server-functions/params";
import { SearchParams } from "@/types/types-params";
import { Suspense } from "react";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const { searchTermStatus, page, searchTerm } = parseClientListParams(params);
    const { invoices, totalPages } = await fetchInvoices(searchTermStatus, page, searchTerm)

    return (
        <FormContainer>
            <FormHeader text={"Manage Invoices"} />
            <Suspense fallback={<SearchFormFallBack variant="invoices" />}>
                <SearchForm variant="invoices" />
            </Suspense>
            <PaginationTabs path={"/billing/manage/invoices"} page={page} totalPages={totalPages} fullWidth />
            <CardView invoices={invoices} />
            <PaginationTabs path={"/billing/manage/invoices"} page={page} totalPages={totalPages} fullWidth />
        </FormContainer>
    );
}
