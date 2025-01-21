export interface city {
    id: number;
    name: string;
    country_id: number;
    country?: {
      id: number;
      name: string;
    };
  }