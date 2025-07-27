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
  path,
  clientListPage,
  totalPages,
}: {
  path: string;
  clientListPage: number;
  totalPages: number;
}) {

  return totalPages > 1 ? (
    <div className="rounded-sm w-full md:w-4/6 p-2 md:p-4 bg-white/30 backdrop-filter backdrop-blur-sm shadow-lg">
      <Pagination>
        <PaginationContent>
          {clientListPage > 1 &&
            <PaginationItem>
              <PaginationPrevious href={path} query={{ page: clientListPage - 1 }} />
            </PaginationItem>
          }
          {clientListPage > 3 &&
            <PaginationItem>
              <PaginationLink  href={path} query={{ page: 1 }}>
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
              <PaginationLink  href={path} isActive={clientListPage === page} query={{ page: page }}>
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
              <PaginationLink  href={path} query={{ page: totalPages }}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          }
          {clientListPage < totalPages &&
            <PaginationItem>
              <PaginationNext  href={path} query={{ page: clientListPage + 1 }} />
            </PaginationItem>}
        </PaginationContent>
      </Pagination>
    </div>
  ) : null;
}