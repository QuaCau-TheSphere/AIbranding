export interface FiberyArticle {
  name: string;
  publicId: string;
  content: {
    md: string;
  };
  creationDate: string;
  date: string;
  description: {
    text: string;
  };
  seoTitle: string;
  seoDescription: {
    text: string;
  };
  slug: string;
  purpose: {
    id: string;
    name: string;
    value: string;
  };
  author: {
    name: string;
    authorTitle: string;
    avatars: {
      name: string;
      secret: string;
      contentType: string;
    };
  };
  files: {
    secret: string;
    name: string;
    contentType: string;
  };
  tags: {
    name: string;
  };
  category: {
    name: string;
  };
  questions: {
    name: string;
    answer: {
      text: string;
    };
  };
}
