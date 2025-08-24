import SearchForm from "@/components/ui/client-list/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { ManageQuoteCardView } from "@/components/ui/manage/quotes/manage-quotes-card-view";
import { PaginationTabs } from "@/components/ui/pagination/pagination-tabs";
import { fetchQuotes } from "@/DAL/dal/stripe-dal";
import { parseClientListParams } from "@/lib/params";
import { SearchParams } from "@/types/types-params";
import { Suspense } from "react";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const { searchTermStatus, page, searchTerm } = parseClientListParams(params);
    const { quotes, totalPages } = await fetchQuotes(searchTermStatus, page, searchTerm)

    return (
        <FormContainer>
            <FormHeader text={"Manage Quotes"} />
            <Suspense>
                <SearchForm variant="quotes" />
            </Suspense>
            <PaginationTabs path={"/billing/manage/quotes"} page={page} totalPages={totalPages} fullWidth />
            <ManageQuoteCardView quotes={quotes} />
            <PaginationTabs path={"/billing/manage/quotes"} page={page} totalPages={totalPages} fullWidth />
        </FormContainer>
    );
}
