/**
 *  @typedef {import('./typedef').District} District
 *  @typedef {import('./typedef').Candidate} Candidate
 *  @typedef {import('./manager').Row} Row
 *  @typedef {import('./manager').Head} Head
 */

import React, { useEffect, useRef } from 'react' // eslint-disable-line
import breakpoint from './breakpoint'
import styled from 'styled-components'

const Table = styled.div`
  display: table;
  font-weight: 500;
  color: #0f2d35;
  font-size: 16px;

  ${(props) => {
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
          font-size: 14px;
          border-top: 1px solid black;
          border-bottom: 1px solid black;
          overflow: hidden;
        `
      }
      case 'rwd':
      default: {
        return `
          @media ${breakpoint.devices.laptop} {
            width: 1200px;
          }

          @media ${breakpoint.devices.laptopBelow} {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            overflow: hidden;
          }

          @media ${breakpoint.devices.tabletBelow} {
            font-size: 14px;
          }
        `
      }
    }
  }}
`

const TBody = styled.div`
  ${(props) => {
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          position: relative;
          background-color: white;
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-behavior: smooth;
        `
      }
      case 'rwd':
      default: {
        return `
          @media ${breakpoint.devices.laptop} {
            display: table-row-group;
          }

          @media ${breakpoint.devices.laptopBelow} {
            /**
             * The reason we make \`TBody\` positioned is because we need it to
             * be an [\`offsetParent\`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
             * When user clicks go-to-specific-district button,
             * which will call \`setSelectedDistrictNumber\`,
             * and the program needs to automatically scroll to the specific district.
             * We need \`TBody\` to be positioned so that the district.\`offsetLeft\` will refer to
             * \`TBody\` rather than the viewport.
             **/
            position: relative;

            background-color: white;
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            overflow-x: scroll;
            overflow-y: hidden;
            scroll-behavior: smooth;
          }

          @media ${breakpoint.devices.tabletBelow} {
          }
        `
      }
    }
  }}
`

const TRow = styled.div`
  ${/**
   *  @param {Object} props
   *  @param {Object} [props.theme]
   *  @param {string} [props.bgColorTheme]
   */
  (props) => {
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          flex-shrink: 0;
        `
      }
      case 'rwd':
      default: {
        return `
          @media ${breakpoint.devices.laptop} {
            display: table-row;
            background: ${
              props.theme?.table?.row?.backgroundColor[props?.bgColorTheme]
                ? props.theme?.table?.row?.backgroundColor[props?.bgColorTheme]
                : '#fff'
            }
          }

          @media ${breakpoint.devices.laptopBelow} {
            flex-shrink: 0;
          }
        `
      }
    }
  }}
`

const TCell = styled.div`
  ${/**
   *  @param {Object} props
   *  @param {Object} props.theme
   *  @param {boolean} [props.multiLines]
   */
  (props) => {
    const baseCss = `
      position: relative;
      
      a {
        color: #d6610c;
        text-decoration: none;
        color: ${
          props.theme?.table?.candidate?.name?.color
            ? props.theme?.table?.candidate?.name?.color
            : '#000'
        };
        pointer-events: ${
          props.theme?.table?.candidate?.name?.isLink ? 'auto' : 'none'
        };
      }
    `
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          ${baseCss}
          max-width: ${props.multiLines ? '187px' : 'none'};
          padding: 15px;
          text-align: left;
          line-height: 150%;
          height: ${props.multiLines ? 'none' : '53px'}; 
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          &:first-child {
            border-left: none;
          }
        `
      }
      case 'rwd':
      default: {
        return `
          ${baseCss}
          @media ${breakpoint.devices.laptop} {
            padding: 8px 30px;
            &:first-child {
              border-bottom: none;
              padding-left: 4px;
            }
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            display: table-cell;
            vertical-align: middle;
          }

          @media ${breakpoint.devices.laptopBelow} {
            padding: 15px;
            text-align: left;
            line-height: 150%;
            border-left: 1px solid rgba(0, 0, 0, 0.1);
            height: 56px;
          }

          @media ${breakpoint.devices.tabletBelow} {
            height: none;
          }
        `
      }
    }
  }}
`

const THead = styled.div`
  ${(props) => {
    const baseCss = `
      background-color: ${props.theme.table.head.backgroundColor};
      color: ${props.theme.table.head.color};
    `
    const mobileCss = `
      border-right: 1px solid black;
      width: 96px;
      flex-shrink: 0;

      ${TRow} {
        flex-shrink: unset;
      }

      ${TCell} {
        text-align: right;
      }
    `
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          ${baseCss}
          ${mobileCss}
        `
      }
      case 'rwd':
      default: {
        const stickyCss = props.theme.stickyTopOffset
          ? `position: sticky; top: ${props.theme.stickyTopOffset}`
          : ''

        return `
          ${baseCss}
          @media ${breakpoint.devices.laptop} {
            display: table-header-group;
            border-bottom: 2px solid black;
            z-index: 2;

            ${TCell} {
              border-bottom: 2px solid black;
            }

            ${stickyCss}
          }

          @media ${breakpoint.devices.laptopBelow} {
            ${mobileCss}
          }
        `
      }
    }
  }}
`

const EntityCell = styled.div`
  ${/**
   *  @param {Object} props
   *  @param {Object} props.theme
   *  @param {boolean} [props.multiLines]
   */
  (props) => {
    const baseCss = `
      display: ${props.multiLines ? 'flex' : 'inline-flex'};
      align-items: center;
      position: relative;

      > a {
        display: inline-flex;
        align-items: center;
      }

      span {
       margin-right: 22px;
      }
    `
    const intervalTiltCss = `
      &:not(:first-child):before {
        content: '/';
        color: rgba(15, 45, 53, 0.3);
        font-size: 14px;
        font-weight: 700;
        position: absolute;
        top: 50%;
        left: -14px;
        transform: translateY(-50%);
        width: 6px;
        height: 21px;
      }
    `
    const intervalEmptyCss = `
      &:not(:first-child):before {
        content: '';
        width: 0;
        height: 0;
      }
    `

    switch (props.theme?.device) {
      case 'mobile': {
        return `
          ${baseCss}
          ${props.multiLines ? intervalEmptyCss : intervalTiltCss};
        `
      }
      case 'rwd':
      default: {
        return `
          ${baseCss}
          ${props.multiLines ? intervalEmptyCss : intervalTiltCss};

          @media ${breakpoint.devices.laptop} {
            ${intervalEmptyCss}
            width: 100%;
            min-height: 52px;
            
            span {
              margin-right: 0px;
            }
          }
        `
      }
    }
  }}
`

const LegislatorPartyNotion = styled.span`
  ${/**
   *  @param {Object} props
   *  @param {Object} props.theme
   */

  (props) => {
    const baseCss = `
      position: absolute;
      color: rgba(15, 45, 53, 0.5);
      text-align: right;
      font-size: 10px;
      max-width: 60px;
      bottom: -8px;
      right: 15px;
    `

    switch (props.theme?.device) {
      case 'mobile': {
        return `
          ${baseCss}
          line-height: 12px;
        `
      }
      case 'rwd':
      default: {
        return `
          ${baseCss}
          line-height: 14px;

          @media ${breakpoint.devices.tablet} {
            bottom: -12px;
          }

          @media ${breakpoint.devices.laptop} {
            font-size: 12px;
            top: -10px;
            right: 30px;
            max-width: none;
          }
        `
      }
    }
  }}
`

/**
 *  @param {Object} props
 *  @param {string} [props.className]
 *  @param {import('./manager').DataManager} props.dataManager
 *  @param {string} props.scrollTo
 */
export default function List({ className, dataManager, scrollTo }) {
  const rows = dataManager.buildListRows()
  const heads = dataManager.buildListHead()
  const data = dataManager.getData()

  const rowId =
    dataManager.findRowByDistrictName(scrollTo)?.id ?? rows?.[0]?.id ?? 'row-1'
  const tBodyRef = useRef(null)
  const tableRef = useRef(null)

  useEffect(() => {
    const node = tBodyRef.current

    // query the selected element according to district number
    const rowNode = node?.querySelector(`[data-row-id="${rowId}"]`)

    // get the number of pixels that the selected element's content is scrolled from its left edge
    const offsetLeft = rowNode?.offsetLeft ?? 0

    // `setTimeout` is to avoid not scrolling on iOS device.
    setTimeout(() => {
      // scroll to the selected element
      node.scrollLeft = offsetLeft
    }, 0)
  }, [scrollTo])

  let previousBgColor = 'dark'
  const rowsJsx = rows.map((row, rowIdx) => {
    const cellsJsx = row.cells.map((cell, cellIdx) => {
      let multiLines = false
      const entitiesJsx = cell.map((entity, entityIdx) => {
        const imgJsx = entity?.imgJsx ?? null
        const labelJsx = entity?.label ? <span>{entity.label}</span> : null
        const entityJsx = entity?.href ? (
          <a href={entity.href}>
            {imgJsx}
            {labelJsx}
          </a>
        ) : (
          <>
            {imgJsx}
            {labelJsx}
          </>
        )
        multiLines = entity.multiLines ?? false
        return (
          <EntityCell multiLines={multiLines} key={entityIdx}>
            {entityJsx}
          </EntityCell>
        )
      })

      return (
        <TCell
          key={cellIdx}
          multiLines={multiLines}
          data-multi-lines={multiLines}
          data-column-id={cellIdx}
          style={
            row.cells?.[cellIdx]?.[0]?.label === ''
              ? { borderLeft: 'none' }
              : undefined
          }
        >
          {entitiesJsx}
        </TCell>
      )
    })

    let currentBgColor = previousBgColor
    const previousRow = rows?.[rowIdx - 1]
    if (previousRow?.group !== row?.group) {
      currentBgColor = previousBgColor === 'dark' ? 'light' : 'dark'
      previousBgColor = currentBgColor
    }

    return (
      <TRow key={row.id} data-row-id={row.id} bgColorTheme={currentBgColor}>
        {cellsJsx}
      </TRow>
    )
  })

  // Since election-type `legislator-party` has `tksRate1`（第一階段投票率） & `tksRate2` data, but only need to show `tksRate1` and add notion: `*得票率=第一階段得票率`.
  // so it's necessary to determine the election type and whether the head is `得票率`.
  const shouldShowHeadNotion = Boolean(data?.type === 'legislator-party')

  return (
    <Table className={className} ref={tableRef}>
      <THead>
        <TRow bgColorTheme="light">
          {heads.map((head, idx) => {
            return (
              <TCell data-column-id={idx} key={`head_${idx}`}>
                {head}

                {shouldShowHeadNotion && head === '得票率' && (
                  <LegislatorPartyNotion>
                    *得票率 = 第一階段得票率
                  </LegislatorPartyNotion>
                )}
              </TCell>
            )
          })}
        </TRow>
      </THead>
      <TBody ref={tBodyRef}>{rowsJsx}</TBody>
    </Table>
  )
}
