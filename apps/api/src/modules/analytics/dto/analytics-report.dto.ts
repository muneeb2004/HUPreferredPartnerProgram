export interface AnalyticsReportDto {
  metrics: {
    totalViews: number;
    totalClicks: number;
    ctr: number;
  };
  timeline: {
    date: string;
    views: number;
    clicks: number;
  }[];
  topOffers: {
    offerId: string;
    title: string;
    views: number;
    clicks: number;
  }[];
}
