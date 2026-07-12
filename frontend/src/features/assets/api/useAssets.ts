import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref, computed, type Ref } from 'vue';
import {
  GetAssetsDocument,
  GetCategoriesDocument,
  RegisterAssetDocument,
  type RegisterAssetInput,
  type AssetFilterInput,
} from 'src/graphql/generated/graphql';

export function useAssets(filter: Ref<AssetFilterInput> = ref({})) {
  const { result, loading, error, refetch } = useQuery(GetAssetsDocument, () => ({
    filter: filter.value,
  }));

  const assets = computed(() => result.value?.assets ?? []);

  return {
    assets,
    loading,
    error,
    refetch,
  };
}

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

export function useRegisterAsset() {
  const { mutate: registerMutate, loading: registerLoading, error: registerError } = useMutation(RegisterAssetDocument);

  async function registerAsset(input: RegisterAssetInput) {
    const result = await registerMutate({ input });
    return result?.data?.registerAsset;
  }

  return {
    registerAsset,
    registerLoading,
    registerError,
  };
}
