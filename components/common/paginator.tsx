import { useMemo } from "react";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextButton,
  PaginationPreviousButton,
} from "@/components/ui/pagination";

export function Paginator({
  total_pages,
  total_results,
  page,
  handleChange,
}: {
  total_pages: number | undefined;
  total_results: number | undefined;
  page: number;
  handleChange: (num: number) => void;
}) {
  const pages = useMemo(
    function () {
      const total = total_pages ?? 0;
      const arr: number[] = [];
      if (total <= 7) {
        let i = 1;
        while (i <= total) {
          arr.push(i++);
        }
        return arr;
      }
      arr.push(1);
      if (page <= 4) {
        let i = 2;
        while (i < total && i <= 5) {
          arr.push(i++);
        }
        arr.push(-1);
      }
      if (page >= 5 && total - page >= 4) {
        arr.push(-1);
        arr.push(page - 1, page, page + 1);
        arr.push(-1);
      }
      if (total - page + 1 <= 4) {
        arr.push(-1);
        let i = total - 4;
        while (i < total) {
          arr.push(i++);
        }
      }
      arr.push(total);
      return arr;
    },
    [page, total_pages]
  );
  if (
    !total_pages ||
    total_pages === 0 ||
    !total_results ||
    total_results === 0
  ) {
    return <></>;
  }
  if (total_pages <= 7) {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPreviousButton
              onClick={() => {
                if (page !== 1) {
                  handleChange(page - 1);
                }
              }}
              disabled={page === 1}
            />
          </PaginationItem>
          {pages.map((item) => (
            <PaginationItem key={item}>
              <PaginationButton
                onClick={() => handleChange(item)}
                isActive={page === item}
              >
                {item}
              </PaginationButton>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNextButton
              onClick={() => {
                if (page !== total_pages) {
                  handleChange(page + 1);
                }
              }}
              disabled={page === total_pages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPreviousButton
            onClick={() => {
              if (page !== 1) {
                handleChange(page - 1);
              }
            }}
            disabled={page === 1}
          />
        </PaginationItem>
        {pages.map((item, index) => (
          <PaginationItem key={index}>
            {item === -1 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationButton
                onClick={() => handleChange(item)}
                isActive={page === item}
              >
                {item}
              </PaginationButton>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNextButton
            onClick={() => {
              if (page !== total_pages) {
                handleChange(page + 1);
              }
            }}
            disabled={page === total_pages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
