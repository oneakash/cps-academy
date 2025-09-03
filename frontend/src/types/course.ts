export interface CourseThumbnail {
  url: string;
  alternativeText: string | null;
}

export interface CourseSummary {
  id: number;
  Title: string;
  Description: string;
  Thumbnail: CourseThumbnail | null;
}

export interface CourseSummaryResponse {
   data: CourseSummary[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}