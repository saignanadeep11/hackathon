import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';

export const GET_ASSETS = gql`
  query GetAssets {
    assets {
      id
      asset_tag
      name
      serial_number
      condition
      location
      status
      category {
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      asset_tag
    }
  }
`;

export function useAssets() {
  const {
    result: assetsResult,
    loading: assetsLoading,
    refetch: refetchAssets,
  } = useQuery(GET_ASSETS);
  const { result: categoriesResult } = useQuery(GET_CATEGORIES);

  const { mutate: createAsset, loading: createAssetLoading } = useMutation(CREATE_ASSET, {
    update: () => {
      void refetchAssets();
    },
  });

  return {
    assetsResult,
    assetsLoading,
    categoriesResult,
    createAsset,
    createAssetLoading,
    refetchAssets,
  };
}
