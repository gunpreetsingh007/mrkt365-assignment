import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import FormTitle from '~/components/FormTitle';
import InterestCheckbox from '~/components/InterestCheckbox';
import { debounce } from 'lodash';
import SkeletonInterestCheckbox from '~/components/SkeltonInterestCheckbox';
import { useMutation, useQuery } from '@apollo/client';
import { GetPaginatedCategoriesQuery, GetTotalPaginatedCountForCategoriesQuery } from '~/utils/graphqlQuery';
import { EditUserInterestsMutation } from '~/utils/graphqlMutation';
import { useAuth } from '~/utils/auth';
import type { Category } from '~/server/graphql/server';


type GetPaginatedCategoriesQueryResponse = {
  data: { getPaginatedCategories: [Category] } | undefined
  loading: boolean
}

export default function MarkInterests() {
  const router = useRouter();
  const { page } = router.query;
  const { currentUser, apolloClient, isAuthInitialize } = useAuth();
  const [totalPaginationCount, setTotalPaginationCount] = useState<number | null>(null);
  const [selectedPagination, setSelectedPagination] = useState<number>(Number(page) || 1);

  const { data: getPaginatedCategoriesResponse, loading: getPaginatedCategoriesLoading }: GetPaginatedCategoriesQueryResponse = useQuery(GetPaginatedCategoriesQuery, {
    variables: {
      page: selectedPagination
    },
    skip: !currentUser || !selectedPagination
  });
  const [getPaginatedCategories, setPaginatedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (getPaginatedCategoriesResponse?.getPaginatedCategories) {
      setPaginatedCategories(getPaginatedCategoriesResponse.getPaginatedCategories);
    }
  }, [getPaginatedCategoriesResponse]);

  const [editUserInterests] = useMutation(EditUserInterestsMutation);
  const [paginationSetStartingNumber, setPaginationSetStartingNumber] = useState(Math.floor((Number(page) || 1 - 1) / 7) * 7 + 1);
  // Define the debounced function using useRef
  const updatePageUrl = useRef(
    debounce((page: number) => {
      router.push({ query: { ...router.query, page: page.toString() } }, undefined, { scroll: false, shallow: true }).catch(console.error);
    }, 100)
  ).current;

  // Trigger the URL update when selectedPagination changes
  useEffect(() => {
    updatePageUrl(selectedPagination);

    // Clean up the debounce handler on unmount or before the next effect runs
    return () => {
      updatePageUrl.cancel();
    };
  }, [selectedPagination, updatePageUrl]);

  useEffect(() => {
    if (isAuthInitialize && !currentUser) {
      router.push('/').catch(console.error);
    }
  }, [currentUser, router, isAuthInitialize]);

  useEffect(() => {
    apolloClient.query({
      query: GetTotalPaginatedCountForCategoriesQuery,
    }).then(({ data }: { data: { getTotalPaginatedCountForCategories: number } }) => {
      setTotalPaginationCount(data?.getTotalPaginatedCountForCategories);
    }).catch(console.error);
  }, [apolloClient]);

  useEffect(() => {
    if(!page) return;
    const pageFromQuery = Number(page);
    if (totalPaginationCount && pageFromQuery > totalPaginationCount) {
      setSelectedPagination(1);
      setPaginationSetStartingNumber(1);
      return;
    }
    // Calculate the new starting number based on the page from the query
    const newStartingNumber = Math.floor((pageFromQuery - 1) / 7) * 7 + 1;
    setSelectedPagination(pageFromQuery);
    setPaginationSetStartingNumber(newStartingNumber);
  }, [page, totalPaginationCount]);

  const handleSingleArrowNextClick = useCallback(() => {
    if (selectedPagination === totalPaginationCount) return;
    if (selectedPagination % 7 === 0) {
      setPaginationSetStartingNumber(paginationSetStartingNumber + 7);
    }
    setSelectedPagination(selectedPagination + 1);
  }, [selectedPagination, totalPaginationCount, paginationSetStartingNumber]);

  const handleSingleArrowPrevClick = useCallback(() => {
    if (selectedPagination === 1) return;
    if ((selectedPagination - 1) % 7 === 0) {
      setPaginationSetStartingNumber(paginationSetStartingNumber - 7);
    }
    setSelectedPagination(selectedPagination - 1);
  }, [selectedPagination, paginationSetStartingNumber]);

  const handleDoubleArrowNextClick = useCallback(() => {
    if (!totalPaginationCount) return;
    setPaginationSetStartingNumber(totalPaginationCount - (totalPaginationCount % 7) + 1);
    setSelectedPagination(totalPaginationCount);
  }, [totalPaginationCount]);

  const handleDoubleArrowPrevClick = useCallback(() => {
    setPaginationSetStartingNumber(1);
    setSelectedPagination(1);
  }, []);

  const handlePageNumberClick = useCallback((pageNumber: number) => {
    setSelectedPagination(pageNumber);
  }, []);

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>, category: Category, index: number) => {
    try {
      editUserInterests({ variables: { categoryId: category.id, isInterested: e.target.checked } }).catch(console.error);
      const temp: Category[] = JSON.parse(JSON.stringify(getPaginatedCategories)) as Category[];
      temp[index]!.isInterested = e.target.checked;
      setPaginatedCategories(temp);
    }
    catch (e) {
    }
  };

  return (
    <>
      <FormTitle title="Please mark your interests!" />
      <div className="flex items-center justify-center self-stretch text-center text-base font-normal leading-[26px] text-black mt-4" >
        <div className="flex items-center justify-end self-stretch" >
          <div className="flex justify-center">
            We will keep you notified.
          </div>
        </div>
      </div>
      <div className="flex items-end self-stretch pt-6 pb-5 text-left text-xl font-medium leading-[26px] text-black" >
        <div>My saved interests!</div>
      </div>
      {getPaginatedCategoriesLoading ? (
        <>
          {Array(7).fill(<SkeletonInterestCheckbox />)}
        </>
      ) : <>
        {getPaginatedCategories?.map((category, index) => (
          <>
            <InterestCheckbox key={category.id} isChecked={category.isInterested} handleClick={(e) => handleCheckboxClick(e, category, index)}>{category.name}</InterestCheckbox>
          </>
        ))}
      </>}
      <div className="flex items-end self-stretch pt-[40px] pb-[25px] text-left text-xl font-medium leading-[26px]" >
        <div>
          <button onClick={handleDoubleArrowPrevClick} className="text-neutral-400" >
            {"<<"}
          </button>
          <button onClick={handleSingleArrowPrevClick} className='text-neutral-400 pl-3'>
            {"<"}
          </button>
          {totalPaginationCount &&
            (Array.from({ length: (paginationSetStartingNumber + 7 > totalPaginationCount) ? (totalPaginationCount - paginationSetStartingNumber + 1) : 7 }, (_, index) => index + paginationSetStartingNumber).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`pl-3 ${selectedPagination === pageNumber ? 'text-black' : 'text-neutral-400'}`}
                onClick={() => handlePageNumberClick(pageNumber)}
              >
                {pageNumber}
              </button>
            )))}
          {totalPaginationCount && <button className='text-neutral-400 pl-3' style={{ display: (totalPaginationCount) > paginationSetStartingNumber + 6 ? 'inline' : 'none' }}>
            {"..."}
          </button>}
          <button onClick={handleSingleArrowNextClick} className="text-neutral-400 pl-3">
            {">"}
          </button>
          <button onClick={handleDoubleArrowNextClick} className='text-neutral-400 pl-3'>
            {">>"}
          </button>
        </div>
      </div>
    </>
  );
};