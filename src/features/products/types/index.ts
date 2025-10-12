export interface Product {
  identifier: number,
  slug: string,
  sku: string,
  stock: number,
  en: {
    title: string,
    details: string,
  };
  ar: {
    title: string,
    details: string,
  };
  colors: ProductColor[];
  reviews: Review[];
  categories: Category[];
  createdDate: string;
  lastChange: string;
  min_price: number;
  max_price: number;
  price_range: string;
  total_images_count: number;
  available_sizes: string[];
  available_colors: string[];
}

export interface ProductColor {
  id: number;
  color_code: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  size: string;
  price: number;
  amount_discount_price: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
}

export interface Category {
  identifier: number;
  slug: string;
  en: {
    title: string;
    details: string;
  };
  ar: {
    title: string;
    details: string;
  };
}

export interface Review {
  id: number;
  order_id: number;
  user_id: number;
  product_id: number;
  rating: string;
  comment: string;
  locale: "en" | "ar";
  status: "pending" | "approved" | "rejected";
  createdDate: string;
  lastChange: string;
}


export interface PaginationData {
  currentPage: number,
  itemsPerPage: number,
  totalPages: number,
  totalItems: number,
  perPage: number
}