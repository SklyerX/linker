export type Link = {
  id: string;
  image: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  url: string;
  description?: string;
  groupId: string;
};

export type Group = {
  id: string;
  groupName: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
};

export type GroupLink = Link & {
  id: string;
};

export type Markdown = {
  id: string;
  title: string;
  content: {
    time: number;
    blocks: Array<any>;
    version: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Tab = {
  icon: string;
  title: string;
  url: string;
};
