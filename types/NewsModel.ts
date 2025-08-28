export type NewsType = {
  id: string;
  title: string;
  category: string;
  thumbnail?: string;
  excerpt: string;
  content: string;
  author: string;
  status: string;
  featured: boolean;
  date: Date;
  views: number
};
