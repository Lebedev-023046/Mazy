export interface IProduct {
  name: string;
  size: number[];
  color: string;
  price: number;
  img: string;
  slug: string;
  year: number;
  rating: number;
  quantity: number;
}

export interface IDBProduct extends IProduct {
  _id: string;
  __v: 0;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ICartProduct extends IDBProduct {
  productCount: number;
}
