export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};
