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
  fullWidth = false,
  path,
  page,
  totalPages,
}: {
  fullWidth?: boolean;
  path: string;
  page: number;
  totalPages: number;
}) {

  return totalPages > 1 ? (
    <div 
      className={`rounded-sm p-2 bg-white/30 backdrop-filter backdrop-blur-sm shadow-lg 
        ${fullWidth ? 'w-full' : 'sm:w-3/6 md:w-4/6'}`}
    >
      <Pagination>
        <PaginationContent>
          {page > 1 &&
            <PaginationItem>
              <PaginationPrevious href={`${path}?page=${page - 1}`} />
            </PaginationItem>
          }
          {page > 2 &&
            <PaginationItem>
              <PaginationLink href={`${path}?page=1`}>
                1
              </PaginationLink>
            </PaginationItem>
          }
          {page > 3 &&
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          }
          {Array.from({ length: Math.min(totalPages, page + 1) - Math.max(1, page - 1) + 1 }, (_, i) => Math.max(1, page - 1) + i).map((p) =>
            <PaginationItem key={p}>
              <PaginationLink 
                href={`${path}?page=${p}`} 
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )}
          {page < totalPages - 2 &&
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          }
          {page < totalPages - 1 &&
            <PaginationItem>
              <PaginationLink href={`${path}?page=${totalPages}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          }
          {page < totalPages &&
            <PaginationItem>
              <PaginationNext href={`${path}?page=${page + 1}`} />
            </PaginationItem>}
        </PaginationContent>
      </Pagination>
    </div>
  ) : null;
}