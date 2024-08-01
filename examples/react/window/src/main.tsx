import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import './index.css'

import { useWindowVirtualizer } from '@tanstack/react-virtual'

function Example() {
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useWindowVirtualizer({
    count: 10000,
    estimateSize: () => 35,
    overscan: 20,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })


  const columnVirtualizer = useWindowVirtualizer({
    count: 2,
    estimateSize: () => 35,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    horizontal: true,
  })


  return (
    <>
      <div ref={listRef} className="List">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div
           style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              // transform: `translateX(${props.columnVirtualizer.getVirtualItems()[0]?.start}px) translateY(${props.rowVirtualizer.options.scrollMargin}px)`,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
             <React.Fragment key={virtualRow.key}>
              {
                columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                  <div
                    key={virtualColumn.key}
                    className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                    style={{
                      transform: `translateY(${
                        virtualRow.start - rowVirtualizer.options.scrollMargin
                      }px)`,
                    }}
                  >
                    Row {virtualRow.index} column: {virtualColumn.index}
                  </div>
                    ))
                  }
            </React.Fragment>
          ))}
            </div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <div>
      <p>
        In many cases, when implementing a virtualizer with a window as the
        scrolling element, developers often find the need to specify a
        "scrollMargin." The scroll margin is a crucial setting that defines the
        space or gap between the start of the page and the edges of the list.
      </p>
      <br />
      <br />
      <h3>Window scroller</h3>
      <Example />
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
