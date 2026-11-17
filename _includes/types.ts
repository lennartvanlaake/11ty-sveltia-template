export type SiteSettings = {
  title: string;
  description: string;
  url?: string;
};

export type Helpers = {
  slug: (value: unknown) => string;
  readableDate: (value: unknown) => string;
  machineDate: (value: unknown) => string;
};

export type NavEntry = {
  url: string;
  data: {
    eleventyNavigation?: {
      title?: string;
    };
  };
};

export type CollectionItem = {
  url: string;
  date: Date;
  data: {
    title?: string;
    author?: string;
    image?: string;
    imageAltText?: string;
    name?: string;
  };
};

export type PageData = {
  title?: string;
  description?: string;
  section?: string;
  summary?: string;
  author?: string;
  image?: string;
  imageAltText?: string;
  name?: string;
  content?: string;
  page: {
    url: string;
    date: Date;
  };
  collections: {
    nav: NavEntry[];
    post: CollectionItem[];
    author: CollectionItem[];
    myAuthors: Record<string, CollectionItem[]>;
  };
  settings: SiteSettings;
  helpers: Helpers;
  eleventy: {
    generator: string;
  };
};
