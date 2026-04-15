export interface Blog {
  id: string;
  slug?: string;
  title: string;
  content: string;
  authorName: string;
  excerpt?: string;
  coverImage?: string;
  cover_image?: string;
  createdAt: string;
  updatedAt?: string;
}
