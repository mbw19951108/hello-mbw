export interface PhotographyModel {
  _id: string;
  title: string;
  location?: string;
  desc?: string;
  photos?: string[];
  date?: number;
}

export interface PhotographyCreateBody {
  title: string;
  location?: string;
  desc?: string;
  photos?: string[];
  date?: number;
}
