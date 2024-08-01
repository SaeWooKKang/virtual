import {  Fragment, type HTMLAttributes, type ReactNode, type RefObject} from "react";
import type { Virtualizer } from "@tanstack/react-virtual";

interface GridVirtualizerTemplateProps {
  parentRef: RefObject<HTMLDivElement>;
  rowVirtualizer: Virtualizer<Window, Element>
  columnVirtualizer: Virtualizer<Window, Element>
  renderItem: (rowIndex: number, columnIndex: number) => ReactNode
  container?: HTMLAttributes<HTMLDivElement>
  list?: HTMLAttributes<HTMLDivElement>
  item?: HTMLAttributes<HTMLDivElement>
}

export const GridVirtualizerTemplate = ({container, list,item, ...props}:GridVirtualizerTemplateProps) => {
  const { style: containerStyle, ...containerProps } = container || {};
  const { style: listStyle, ...listProps } = list || {};
  const { style: itemStyle, ...itemProps } = item || {};
  
  return (
    <div
      ref={props.parentRef}
      className="List"
      style={{
        // height: `500px`,
        // width: `500px`,
        overflow: 'auto',
        ...containerStyle
      }}
      {...containerProps}
    >
    <div
      style={{
        height: `${props.rowVirtualizer.getTotalSize()}px`,
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
          ...listStyle
        }}
        {...listProps}
        >
        {props.rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <Fragment key={virtualRow.key}>
            {props.columnVirtualizer.getVirtualItems().map((virtualColumn) => (
              <div
                key={virtualColumn.key}
                style={{
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  ...itemStyle
                }}
                {...itemProps}
              >
                {props.renderItem(virtualRow.index, virtualColumn.index)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  </div>
  )
}
