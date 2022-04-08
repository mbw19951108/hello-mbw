export interface CategoryModel {
  _id: string;
  title: string;
  parent_id: string;
  sort: number;
  children?: CategoryModel[];
}

export interface CategoryCreateBody {
  title: string;
  parent_id?: string;
  sort?: number;
}

export interface CategoryUpdateBody {
  title: string;
  parent_id?: string;
  sort?: number;
}
