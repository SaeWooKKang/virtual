import React from 'react'
import ReactDOM from 'react-dom'
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query'

import './index.css'

import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual'
import { GridVirtualizerTemplate } from './GridVirtualizerTemplate';

const queryClient = new QueryClient()

async function fetchServerPage(
  limit: number,
  offset: number = 0,
): Promise<{ rows: Array<string>; nextOffset: number }> {
  const rows = new Array(limit)
    .fill(0)
    .map((e, i) => `Async loaded row #${i + offset * limit}`)

    console.log('fetch triggered!')

  await new Promise((r) => setTimeout(r, 500))


  return { rows, nextOffset: offset + 1 }
}

function getIndexFromRowCol(row: number, col: number, numCols: number): number {
  if (col < 0 || col >= numCols) {
    throw new Error(`Column must be between 0 and ${numCols - 1}`);
  }
  return row * numCols + col;
}

function App() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: (ctx) => {
      console.log('ctx.pageParam: ', ctx.pageParam)

      return fetchServerPage(10, ctx.pageParam)
    },
    getNextPageParam: (_lastGroup, groups) => groups.length,
    initialPageParam: 0,
  })

  const allRows = data ? data.pages.flatMap((d) => d.rows) : []
  console.log(allRows)

  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    // getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  })

  const columVirtualizer = useWindowVirtualizer({
    count: 3,
    // getScrollElement: () => parentRef.current,
    estimateSize: () => 10000,
    overscan: 5,
    horizontal: true,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  React.useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()

    if (!lastItem) {
      return
    }

    const isBottom = lastItem.index >= allRows.length - 1

    if (
      isBottom &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ])

  return (
    <div>
      <p>
        This infinite scroll example uses React Query's useInfiniteScroll hook
        to fetch infinite data from a posts endpoint and then a rowVirtualizer
        is used along with a loader-row placed at the bottom of the list to
        trigger the next page to load.
      </p>

      <br />
      <br />

      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {(error).message}</span>
      ) : (
        <GridVirtualizerTemplate 
          columnVirtualizer={columVirtualizer}
          rowVirtualizer={rowVirtualizer}
          parentRef={parentRef}
          list={{
            style:{
              gridTemplateColumns: '1fr 1fr 1fr'
            }
          }}
          renderItem={(rowIndex, columnIndex) => {
            const current = getIndexFromRowCol(rowIndex, columnIndex, 3)
            return (<div>rowIndex: {rowIndex} columnIndex: {columnIndex}</div>)
            return (<div> {allRows[current]}</div>)
          }}
        />
      )}
      <div>
        {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
      </div>
      <br />
      <br />
      {process.env.NODE_ENV === 'development' ? (
        <p>
          <strong>Notice:</strong> You are currently running React in
          development mode. Rendering performance will be slightly degraded
          until this application is build for production.
        </p>
      ) : null}
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
