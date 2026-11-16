export type MenuItem = {
  id: string;
  nameEn: string;
  nameGu: string | null;
  description?: string | null;
  descriptionGu?: string | null;
  price: number;
  imageUrl?: string | null;
  badge?: string | null;
  isVeg?: boolean;
  sort?: number;
  available: boolean;
  visible?: boolean;
  categoryId?: string;
};

export type Item = MenuItem;

export type MenuCategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameGu: string | null;
  shortNameEn?: string | null;
  shortNameGu?: string | null;
  groupEn?: string | null;
  groupGu?: string | null;
  kind: string;
  note?: string | null;
  noteGu?: string | null;
  iconKey?: string | null;
  sort?: number;
  visible?: boolean;
  items: MenuItem[];
  _count?: { items: number };
};

export type Category = MenuCategory;

export type RestaurantNotice = {
  id: string;
  textEn: string;
  textGu: string | null;
  sort?: number;
};

export type Notice = RestaurantNotice;

export type RestaurantInfo = {
  id?: string;
  name: string;
  tagline: string | null;
  address: string | null;
  phone: string | null;
  mobile: string | null;
  banner: string | null;
  siteUrl?: string | null;
  logoUrl?: string | null;
  showBothLanguages?: boolean;
  notices: RestaurantNotice[];
};

export type Restaurant = RestaurantInfo;
