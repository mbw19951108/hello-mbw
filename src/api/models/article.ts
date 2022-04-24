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

export interface ArticleQueryModel extends PageQueryModel {
  showAll?: boolean; // 是否展示未发布文章
  pageable?: number; // 是否启用分页查询（仅限后台管理页面使用）
  categoryId?: string; // 文章分类
}