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

  return totalPages > 1 ? (
    <div className="rounded-sm w-full md:w-4/6 p-2 md:p-4 bg-white/30 backdrop-filter backdrop-blur-sm shadow-lg">
      <Pagination>
        <PaginationContent>
          {clientListPage > 1 &&
            <PaginationItem>
              <PaginationPrevious href="client-list" query={{ clientListPage: clientListPage - 1 }} />
            </PaginationItem>
          }
          {clientListPage > 3 &&
            <PaginationItem>
              <PaginationLink href="client-list" query={{ clientListPage: 1 }}>
                1
              </PaginationLink>
            </PaginationItem>
          }
          {clientListPage > 3 &&
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          }
          {Array.from({ length: Math.min(2, totalPages - Math.max(clientListPage - 1, 0)) }, (_, i) => Math.max(clientListPage - 0, 1) + i).map((page) =>
            <PaginationItem key={page}>
              <PaginationLink href="client-list" isActive={clientListPage === page} query={{ clientListPage: page }}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )}
          {clientListPage < totalPages - 1 &&
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          }
          {clientListPage < totalPages - 1 &&
            <PaginationItem>
              <PaginationLink href="client-list" query={{ clientListPage: totalPages }}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          }
          {clientListPage < totalPages &&
            <PaginationItem>
              <PaginationNext href="client-list" query={{ clientListPage: clientListPage + 1 }} />
            </PaginationItem>}
        </PaginationContent>
      </Pagination>
    </div>
  ) : null;
}