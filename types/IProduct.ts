export interface IProduct {
  id: string;
  name: string;
  size: number[];
  color: string;
  price: number;
  img: string;
  slug: string;
  year: number;
  popular: boolean;
  brand: string;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ICartProduct extends IProduct {
  productCount: number;
}
