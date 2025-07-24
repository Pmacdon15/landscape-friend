import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationTabs({
  clientListPage,
  totalPages,
}: {
  clientListPage: number;
  totalPages: number;
}) {
  const startPage = Math.max(0, clientListPage - 1);
  const endPage = Math.min(totalPages - 1, startPage + 2);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>

          {clientListPage > 0 && (
            <PaginationItem>
              <PaginationPrevious href="client-list" query={{ clientListPage: clientListPage - 1 }} />
            </PaginationItem>
          )}
        </PaginationItem>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href="client-list" isActive={clientListPage === page} query={{ clientListPage: page }}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {endPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {clientListPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationNext href="client-list" query={{ clientListPage: clientListPage + 1 }} />
          </PaginationItem>)}
      </PaginationContent>
    </Pagination>
  );
}