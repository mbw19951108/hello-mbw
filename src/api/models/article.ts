export interface ArticleModel {
  _id: string;
  category_id: string;
  title: string;
  keywords?: string;
  content?: string;
  mdcontent?: string;
  click_count: number;
  created_time: number;
  updated_time?: number;
  is_show: boolean;
}

export interface ArticleCreateBody {
  category_id: string;
  title: string;
}

export interface ArticleUpdateBody {
  title?: string;
  content?: string;
  mdcontent?: string;
  keywords?: string;
}
