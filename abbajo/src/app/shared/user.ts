export interface User {
  id: number;
  firstname: string;  
  lastname: string;   
  email: string;
  phone: string;
  dob: string;
  bio: string | null | undefined;
  car: {
    type: string | null | undefined;
    carseats: number | null | undefined
  };
  location: {
    id: number;
    address: string;
    city_id: number;
    city?: {
      id: number;
      name: string;
      country_id: number;
      country?: {
        id: number;
        name: string;
      };
    };
  };
}