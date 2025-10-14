import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/shared/utils/utils";
import { useApp } from "@/shared/contexts/AppContext";
import { useSharedTranslations } from "@/shared/hooks/useTranslation";

interface ProfessionalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  isLoading?: boolean;
}

export const ProfessionalPagination: React.FC<ProfessionalPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages,
  isLoading,
}) => {
  const { isRTL } = useApp();
  const { t: commonT } = useSharedTranslations("common");

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= (maxVisiblePages || 5)) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate the start and end of the visible pages
      let start = Math.max(1, currentPage - Math.floor((maxVisiblePages || 5) / 2));
      const end = Math.min(totalPages, start + (maxVisiblePages || 5) - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < (maxVisiblePages || 5)) {
        start = Math.max(1, end - (maxVisiblePages || 5) + 1);
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('ellipsis');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
      return pages;
    }
  }

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading) {
      onPageChange(currentPage - 1);
    }
  }

  const handlePervious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  }

  if (totalPages <= 1) return null;

    return (
    <div className={cn("flex items-center justify-center gap-1 animate-in fade-in-0 slide-in-from-bottom-2 duration-500", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePervious}
        disabled={currentPage === 1 || isLoading}
        className={cn(
          "h-8 px-3 text-sm font-medium transition-all duration-200",
          "hover:bg-primary/10 hover:border-primary/20",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          isRTL ? "rounded-l-none rounded-r-md" : "rounded-l-md rounded-r-none"
        )}
      >
        {(() => {
          const label = isRTL ? commonT("buttons.previous") : commonT("buttons.previous");
          const shortLabel = isRTL ? commonT("buttons.previous") : commonT("buttons.previous");
          const Icon = isRTL ? ChevronRight : ChevronLeft;
          const iconClass = isRTL ? "h-4 w-4 ml-1" : "h-4 w-4 mr-1";
          return (
            <>
              <Icon className={iconClass} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </>
          );
        })()}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages?.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          const isActive = page === currentPage;
          
          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageClick(page)}
              disabled={isLoading}
              className={cn(
                "h-8 w-8 p-0 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "hover:bg-primary/10 hover:border-primary/20",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className={cn(
          "h-8 px-3 text-sm font-medium transition-all duration-200",
          "hover:bg-primary/10 hover:border-primary/20",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          isRTL ? "rounded-l-md rounded-r-none" : "rounded-l-none rounded-r-md"
        )}
      >
        {(() => {
          const label = isRTL ? commonT("buttons.next") : commonT("buttons.next");
          const Icon = isRTL ? ChevronLeft : ChevronRight;
          const iconClass = isRTL ? "h-4 w-4 ml-1" : "h-4 w-4 mr-1";
          return (
            <>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label}</span>
              <Icon className={iconClass} />
            </>
          );
        })()}
      </Button>
    </div>
  );
}