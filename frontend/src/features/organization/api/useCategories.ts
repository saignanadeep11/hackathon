import { useQuery, useMutation } from '@vue/apollo-composable';
import { computed, ref } from 'vue';
import {
  GetCategoriesDocument,
  CreateCategoryDocument,
  GetCategoriesPageDocument,
  UpdateCategoryDocument,
} from 'src/graphql/generated/graphql';
import type { CategoryFilterInput } from 'src/graphql/generated/graphql';

export function useCategories() {
  const { result, loading, error, refetch } = useQuery(GetCategoriesDocument);
  const categories = computed(() => result.value?.categories ?? []);

  return {
    categories,
    loading,
    error,
    refetch,
  };
}

export function useCategoriesPage(
  variables: {
    filter?: CategoryFilterInput;
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  } = {},
) {
  // Use a reactive ref for variables so we can update them and trigger a refetch
  const variablesRef = ref(variables);

  const { result, loading, error, refetch, fetchMore } = useQuery(
    GetCategoriesPageDocument,
    variablesRef,
    { fetchPolicy: 'cache-and-network' },
  );

  const pageResult = computed(() => result.value?.categoriesPage);
  const categories = computed(() => pageResult.value?.edges.map((e) => e.node) ?? []);
  const pageInfo = computed(() => pageResult.value?.pageInfo);
  const totalCount = computed(() => pageResult.value?.totalCount ?? 0);

  return {
    variables: variablesRef,
    categories,
    pageInfo,
    totalCount,
    loading,
    error,
    refetch,
    fetchMore,
  };
}

export function useCreateCategory() {
  const {
    mutate: createMutate,
    loading: createLoading,
    error: createError,
  } = useMutation(CreateCategoryDocument);

  async function createCategory(name: string, customFieldsSchema: string) {
    const result = await createMutate({ name, customFieldsSchema });
    return result?.data?.createCategory;
  }

  return {
    createCategory,
    createLoading,
    createError,
  };
}

export function useUpdateCategory() {
  const {
    mutate: updateMutate,
    loading: updateLoading,
    error: updateError,
  } = useMutation(UpdateCategoryDocument);

  async function updateCategory(id: string, name?: string, customFieldsSchema?: string) {
    const result = await updateMutate({ id, name, customFieldsSchema });
    return result?.data?.updateCategory;
  }

  return {
    updateCategory,
    updateLoading,
    updateError,
  };
}
