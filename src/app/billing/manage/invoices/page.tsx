import { fetchInvoices } from "@/DAL/dal-stripe";
import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { CardView } from "@/components/ui/manage-invoices/manage-invoices-card-view";
import { PaginationTabs } from "@/components/ui/pagination/pagination-tabs";
import { parseClientListParams } from "@/lib/params";
import { SearchParams } from "@/types/types-params";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const { searchTermStatus, page, searchTerm } = parseClientListParams(params);
    const { invoices, totalPages } = await fetchInvoices(searchTermStatus, page, searchTerm)

    return (
        <FormContainer>
            <FormHeader text={"Manage Invoices"} />
            <SearchForm variant="invoices" />
            <PaginationTabs path={"/billing/manage/invoices"} page={page} totalPages={totalPages} fullWidth />           
            <CardView invoices={invoices} />
            <PaginationTabs path={"/billing/manage/invoices"} page={page} totalPages={totalPages} fullWidth />
        </FormContainer>
    );
}
