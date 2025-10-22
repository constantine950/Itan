import { SetStateAction } from "react";

export interface Event {
  id: string;
  title: string;
  year: number;
  description: string;
  image_url?: string;
}

export interface EventProps {
  id: string;
  image_url: string;
  title: string;
  year: number;
  description: string;
}

export type Category = {
  id: string;
  name: string;
};

export type Eventt = {
  id: string;
  title: string;
  year: number;
  description: string;
  image_url?: string;
  category_id: string;
  categoryName?: string;
};

export interface FilterProps {
  search: string;
  setSearch: (value: SetStateAction<string>) => void;
  category: string;
  setCategory: (value: SetStateAction<string>) => void;
  categoryList: (string | undefined)[];
}

export interface EventPageProps {
  params: Promise<{ id: string }>;
}
