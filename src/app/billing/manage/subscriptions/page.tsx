
import SearchForm from "@/components/ui/search/search-form";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { CardView } from "@/components/ui/manage/subscription/manage-subscription-card-view";
import { PaginationTabs } from "@/components/ui/pagination/pagination-tabs";
import { fetchSubscriptions } from "@/lib/dal/stripe-dal";
import { parseClientListParams } from "@/lib/utils/params";
import { SearchParams } from "@/types/params-types";
import { Suspense } from "react";
import SearchFormFallBack from "@/components/ui/fallbacks/search/search-form-fallback";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const { searchTermStatus, page, searchTerm } = parseClientListParams(params);
    const { subscriptions, totalPages } = await fetchSubscriptions(searchTermStatus, page, searchTerm)
   
    return (
        <FormContainer>
            <FormHeader text={"Manage Subscriptions"} />

            <Suspense fallback={<SearchFormFallBack variant="subscriptions" />}>
                <SearchForm variant="subscriptions" />
            </Suspense>
            <PaginationTabs path={"/billing/manage/subscription"} page={page} totalPages={totalPages} fullWidth />
            <CardView subscriptions={subscriptions} />
            <PaginationTabs path={"/billing/manage/subscription"} page={page} totalPages={totalPages} fullWidth />
        </FormContainer>
    );
}
