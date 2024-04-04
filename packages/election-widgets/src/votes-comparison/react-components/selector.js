import React, { useEffect, useRef, useState } from 'react' // eslint-disable-line
import breakpoints from './breakpoint'
import styled from 'styled-components'
import { CloseIcon } from './icons'
import useClickOutside from './hooks/use-click-outside'

const Container = styled.div`
  ${(props) => {
    const baseCss = `
      > div:first-child {
        display: inline-block;
        background-color: ${props.theme.selector.leftBlock.backgroundColor};
        color: ${props.theme.selector.leftBlock.color};
      }
      > div {
        padding: 12px 8px;
        border: 2px solid black;
      }

      > div:last-child {
        cursor: pointer;
        border-left: none;
        width: 210px;
        background-color: white;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
      }
    `
    const mobileCss = `
      > div:last-child {
        width: 184px;
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
        return `
          ${baseCss}
          @media ${breakpoints.devices.tabletBelow} {
            ${mobileCss}
          }
        `
      }
    }
  }}
`

const Triangle = styled.div`
  border-style: solid;
  border-width: 15px 9px 0 9px;
  border-color: black transparent transparent transparent;
`

/**
 *  @callback OnSelect
 *  @param {string|undefined} districtName
 */

/**
 *  @callback RenderFullOption
 *  @param {string} option
 *  @returns {string}
 */

/**
 *  @param {Object} props
 *  @param {string} [props.className]
 *  @param {string[]} [props.options=[]]
 *  @param {string} props.defaultValue
 *  @param {OnSelect} [props.onSelect]
 *  @param {RenderFullOption} [props.renderFullOption]
 */
export default function Selector({
  className,
  options = [],
  defaultValue,
  onSelect,
  renderFullOption,
}) {
  const [toOpenLightBox, setToOpenLightBox] = useState(false)
  return (
    <>
      <Container className={className}>
        <div>移動至</div>
        <div onClick={() => setToOpenLightBox(true)}>
          <span>
            {renderFullOption ? renderFullOption(defaultValue) : defaultValue}
          </span>
          <Triangle />
        </div>
      </Container>
      {toOpenLightBox ? (
        <Picker
          options={options}
          onSelect={(selected) => {
            if (typeof selected === 'string') {
              onSelect(selected)
            }
            setToOpenLightBox(false)
          }}
        />
      ) : null}
    </>
  )
}

const LightBoxContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.66);
  display: flex;
`

const LightBoxBody = styled.div`
  margin: auto;

  background-color: white;
  border-radius: 4px;
  min-width: 200px;

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;

    svg {
      cursor: pointer;
    }
  }

  > div:last-child {
    display: flex;
    flex-wrap: wrap;
    margin-top: 25px;
  }

  ${(props) => {
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          padding: 16px 16px 20px 16px;
          gap: 12px 15px;
          width: 288px;
          > div:last-child {
            gap: 12px 15px;
          }
        `
      }
      case 'rwd':
      default: {
        return `
          @media ${breakpoints.devices.laptopBelow} and ${breakpoints.devices.tablet} {
            padding: 25px 40px 40px 40px;
            width: 688px;
            > div:last-child {
              gap: 12px 18px;
            }
          }
          @media ${breakpoints.devices.tabletBelow} {
            padding: 16px 16px 20px 16px;
            width: 288px;
            > div:last-child {
              gap: 12px 15px;
            }
          }
        `
      }
    }
  }}
`

const StyledOption = styled.div`
  ${(props) => {
    const baseCss = `
      cursor: pointer;
      border: 1px solid ${props.theme.selector.picker.option.borderColor};
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 150%;
      color: ${props.theme.selector.picker.option.color};
      border-radius: 32px;
      &:hover {
        background-color: ${props.theme.selector.picker.option.backgroundColor};
      }
    `
    switch (props.theme?.device) {
      case 'mobile': {
        return `
          ${baseCss}
          padding: 4px 12px;
        `
      }
      case 'rwd':
      default: {
        return `
          ${baseCss}
          @media ${breakpoints.devices.laptopBelow} and ${breakpoints.devices.tablet} {
            padding: 4px 16px;
            min-width: 59px;
          }
          @media ${breakpoints.devices.tabletBelow} {
            padding: 4px 12px;
            min-width: 51px;
          }
        `
      }
    }
  }}
`

/**
 *  @param {Object} props
 *  @param {string[]} props.options
 *  @param {OnSelect} props.onSelect
 */
function Picker({ options, onSelect }) {
  useEffect(() => {
    const lightbox = containerRef.current
    const preventDefault = (e) => {
      e.preventDefault()
    }
    if (lightbox) {
      // lock scroll
      lightbox.addEventListener('wheel', preventDefault, { passive: false })
      lightbox.addEventListener('touchmove', preventDefault, { passive: false })
    }

    // clear event listeners
    return () => {
      lightbox.removeEventListener('wheel', preventDefault)
      lightbox.removeEventListener('touchmove', preventDefault)
    }
  }, [])

  const containerRef = useRef(null)
  const bodyRef = useRef(null)
  useClickOutside(bodyRef, () => {
    onSelect(undefined)
  })
  const optionsJsx = options.map((o, idx) => {
    return (
      <StyledOption key={idx} onClick={() => onSelect(o)}>
        {o}
      </StyledOption>
    )
  })

  return (
    <LightBoxContainer ref={containerRef}>
      <LightBoxBody ref={bodyRef}>
        <div>
          <span>請選擇選區</span>
          <div onClick={() => onSelect(undefined)}>
            <CloseIcon />
          </div>
        </div>
        <div>{optionsJsx}</div>
      </LightBoxBody>
    </LightBoxContainer>
  )
}
