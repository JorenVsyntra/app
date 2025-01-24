export interface travel {
    id: number;
    destination_id: number;
    start_location_address: string;
    travel_date: string;
    travel_fee: number;
    travel_km: number;
    destination_city_id: number;
    start_city_id: number;
    destination_city_name: string;
    start_city_name: string;
    destination_country_id: number;
    start_country_id: number;
    destination_country_name: string;
    start_country_name: string;
    driver_id: number;
    driver_firstname: string;
    driver_lastname: string;
    car_id: number;
    car_type: string;
    car_carseats: number;
    passengers_count: number;
  }
   