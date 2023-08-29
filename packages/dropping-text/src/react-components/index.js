import Matter from 'matter-js'
import styled from '../styled-components.js'
import { useCallback, useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

const { Bodies, Body, Common, Composite, Engine } = Matter

const Block = styled.div`
  background: #ffffff;
  /* font-family set here is for better performance. */
  /* If the webpage uses other font-family, such as adobe fonts, google fonts */
  /* and the dropping effect will be slow and laggy. */
  font-family: sans-serif;

  line-height: 1;

  position: relative;
  font-size: 20px;
  overflow: hidden;
  & > img.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ${/**
   *  @param {Object} props
   *  @param {boolean} porps.initialRender
   */
  ({ initialRender }) => {
    if (initialRender) {
      return `
        & > span {
          position: static;
          line-height: 20px;
        }

        @media (max-width: 767px) {
          & > span {
            font-size: 12px;
            line-height: 12px;
          }
        }
      `
    }
    return `
      & > span {
        position: absolute;
        line-height: 1.2;
      }
      @media (max-width: 767px) {
        & > span {
          font-size: 12px;
          line-height: 1.5;
        }
      }
    `
  }}
`

const Text = styled.span`
  color: #000000;
  font-size: 20px;
  user-select: none;
  visibility: hidden;
`

function findOverflowIdx(nodeList, overflowThreshold) {
  for (let i = nodeList.length - 1; i >= 0; i--) {
    const node = nodeList[i]
    if (node.offsetTop < overflowThreshold) {
      return i + 1
    }
  }

  return nodeList.length
}

/**
 *  @typedef {Object} DroppingTextProps
 *  @property {string[]} textArr
 *  @property {number} [canvasWidth] - if not provided, then default value will be `window.innerWidth`
 *  @property {number} [canvasHeight] - if not provided, then default value will be `window.innerHeight`
 *  @property {boolean} showLoadingImg=true]
 *  @property {string} [loadingImgSrc='https://unpkg.com/@readr-media/react-dropping-text/assets/loading.gif']
 */

/**
 *  @param {DroppingTextProps} props
 *  @returns {React.ReactElement}
 */
export default function DroppingText({
  textArr,
  canvasWidth,
  canvasHeight,
  showLoadingImg = true,
  loadingImgSrc = 'https://unpkg.com/@readr-media/react-dropping-text/assets/loading.gif',
}) {
  const defaultOverflowIdx = textArr.length + 1
  // `overflowIdx` is used to truncate `textArr` if `textArr` items are
  // over the `DroppingText` canvas.
  const [overflowIdx, setOverflowIdx] = useState(defaultOverflowIdx)
  const [objsForRequestAnimationFrame, setObjsForRaf] = useState(null)
  const [height, setHeight] = useState(canvasHeight ?? '100vh')
  const [inViewRef, inView] = useInView()
  const blockRef = useRef()
  const truncatedTextArr = textArr.slice(0, overflowIdx)
  const initialRender = overflowIdx === defaultOverflowIdx

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node) => {
      // Ref's from useRef needs to have the node assigned to `current`
      blockRef.current = node
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node)
    },
    [inViewRef]
  )

  // This a workaround to solve in-app rendering issue.
  // If we use iOS in-app browser to render 100vh block,
  // and the in-app browser will change block's height
  // while scrolling down/up.
  //
  // Therefore, we use state to store the block's height
  // rather than setting `100vh`.
  useEffect(() => {
    if (blockRef.current) {
      const block = blockRef.current
      const height = block?.clientHeight
      if (height) {
        setHeight(height)
      }
    }
  }, [])

  useEffect(() => {
    const droppingTextNodes = blockRef.current?.querySelectorAll(
      '[data-dropping-text=true]'
    )

    const _canvasWidth = canvasWidth ?? window.innerWidth
    const _canvasHeight = canvasHeight ?? window.innerHeight

    if (initialRender) {
      // If `textArr` has too many items, and then the items may fill up the screen,
      // or even overflow the screen.
      // For better perforance, we could truncate those overflowed items.
      // `findOverflowIdx` is to find the index of an item which overflows the screen.
      const idx = findOverflowIdx(droppingTextNodes, _canvasHeight)

      // intentionally to render loading image
      if (showLoadingImg) {
        setTimeout(() => {
          setOverflowIdx(idx)
        }, 1000)
      } else {
        setOverflowIdx(idx)
      }
      return
    }

    const wallWidth = 60 // px
    const droppingDistanceInterval = 100 // px

    const engine = Engine.create()

    // adjust animation speed
    engine.timing.timeScale = 1.2

    const textRectangles = []

    for (let i = 0; i < droppingTextNodes.length; i++) {
      // dropping text node
      const dtn = droppingTextNodes[i]
      const blockWidth = dtn?.clientWidth
      const blockHeight = dtn.clientHeight

      // random x for initial position of dropping texts
      const randomX = Common.random(wallWidth, _canvasWidth - wallWidth)

      // the smaller value, the later dropping
      const y = 0 - i * droppingDistanceInterval

      // create the rectangle for the certain dropping text
      const rectangle = Bodies.rectangle(randomX, y, blockWidth, blockHeight)

      // random rotate degree of the dropping rectangle
      const randomDegree = Common.random(-60, 60)
      const radian = (randomDegree * Math.PI) / 180

      // rotate the rectangle
      Body.setAngle(rectangle, radian)

      const textRectangle = {
        w: blockWidth,
        h: blockHeight,
        matterBody: rectangle,
        domElement: dtn,
        render() {
          const { x, y } = this.matterBody.position
          if (x > _canvasWidth || x < 0) {
            return
          }
          if (y > _canvasHeight) {
            return
          }
          const _y = `${y - this.h / 2}px`
          const _x = `${x - this.w / 2}px`
          // @ts-ignore
          this.domElement.style.transform = `translate(${_x}, ${_y}) rotate(${this.matterBody.angle}rad)`
          // @ts-ignore
          this.domElement.style.visibility = 'visible'
        },
      }

      textRectangles.push(textRectangle)
    }

    // Add text rectangles into world
    Composite.add(
      engine.world,
      textRectangles.map((tr) => tr.matterBody)
    )

    const walls = [
      // ground
      Bodies.rectangle(
        _canvasWidth / 2, // x position
        _canvasHeight, // y position
        _canvasWidth, // ground width
        wallWidth, // ground height
        { isStatic: true }
      ), // static in the engine world, which means it won't move

      // left wall
      Bodies.rectangle(
        0, // x position
        _canvasHeight / 2, // y position
        wallWidth, // wall width
        _canvasHeight, // wall height
        { isStatic: true }
      ),

      // right wall
      Bodies.rectangle(
        _canvasWidth, // x position
        _canvasHeight / 2, // y position
        wallWidth, // wall width
        _canvasHeight, // wall height
        { isStatic: true }
      ),
    ]

    // Add walls into world
    Composite.add(engine.world, walls)

    setObjsForRaf({
      matterEngine: engine,
      textRectangles,
    })
  }, [overflowIdx])

  useEffect(() => {
    if (objsForRequestAnimationFrame === null) {
      return
    }
    const { matterEngine, textRectangles } = objsForRequestAnimationFrame

    let raf
    if (inView) {
      const rerender = () => {
        // update dropping text css
        textRectangles.forEach((tr) => {
          tr.render()
        })
        Engine.update(matterEngine)
        raf = requestAnimationFrame(rerender)
      }
      raf = requestAnimationFrame(rerender)
    }
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [objsForRequestAnimationFrame, inView])

  const jsx = (
    <>
      {showLoadingImg && initialRender && (
        <img className="loading" src={loadingImgSrc} />
      )}
      {truncatedTextArr.map((txt, idx) => {
        return (
          <Text
            className="text"
            key={idx}
            data-dropping-text
            dangerouslySetInnerHTML={{ __html: txt }}
          />
        )
      })}
    </>
  )

  return (
    <Block
      style={{
        width: typeof canvasWidth === 'number' ? `${canvasWidth}px` : '100vw',
        height,
      }}
      ref={setRefs}
      /**
       * For better performance,
       * we separate rendering logics to two steps.
       * First step, also called initial render,
       * is to render `visibility: hidden` texts.
       * These hidden texts are used to calculate `overflowIdx` state.
       *
       * After `overflowIdx` state changed,
       * we rerender the truncated texts,
       * and start to run matter engine to
       * drop the texts.
       */
      initialRender={initialRender}
    >
      {jsx}
    </Block>
  )
}
