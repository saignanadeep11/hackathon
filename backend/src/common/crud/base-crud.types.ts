import { SortInput } from './base-crud.dtos';

export type ScalarFilterValue = {
  eq?: string;
  ne?: string;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  in?: string[];
  nin?: string[];
  like?: string;
  ilike?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  icontains?: string;
  istartsWith?: string;
  iendsWith?: string;
  isNull?: boolean;
};

export type FilterNode = Record<string, unknown> & {
  and?: FilterNode[];
  or?: FilterNode[];
};

export type QueryArgs<TFilter> = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  limit?: number;
  offset?: number;
  sort?: SortInput[];
  filter?: TFilter;
};

export type FilterNodeConfig = {
  filterableFields: Record<string, string>;
  relations?: Record<string, RelationFilterConfig>;
};

export type RelationFilterConfig = {
  path: string;
  alias: string;
  node: FilterNodeConfig;
};

export type CursorPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type OffsetPageInfo = {
  limit: number;
  offset: number;
};
