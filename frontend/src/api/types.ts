export interface ProductImage {
  id: number;
  image: string;
  image_url?: string;
  alt_text?: string;
  display_order?: number;
  is_feature?: boolean;
  colour_variant?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  current_price?: string | number;
  description: string;
  category: Category | string | number;
  category_name?: string;
  main_image: string;
  display_image_url?: string;
  gallery_images?: string[];
  images: ProductImage[];
  stock_quantity: number;
  available_colours?: string;
  available_sizes?: string;
  material?: string;
  color_variants?: string[];
  is_in_stock?: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN';
  is_service_provider?: boolean;
  is_admin?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface AddressRecord {
  id: number;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
}

export interface OrderItemRecord {
  id?: number;
  product?: number | null;
  product_name: string;
  sku?: string;
  unit_price?: string | number;
  quantity: number;
  selected_size?: string;
  selected_colour?: string;
  line_total?: string | number;
}

export interface OrderRecord {
  id: number;
  order_number: string;
  user_email?: string;
  status: string;
  subtotal?: string | number;
  shipping_fee?: string | number;
  discount_amount?: string | number;
  total_amount: string | number;
  customer_name: string;
  phone_number: string;
  shipping_address: string;
  items?: OrderItemRecord[];
  created_at: string;
  updated_at?: string;
}
