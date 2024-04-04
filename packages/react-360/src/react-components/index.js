import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useOnceShown from './hook/useOnceShown.js'
import ReactPannellum from './components/react-pannellum.js'
import InteractionHint from './components/interaction-hint.js'

const Wrapper = styled.div``

const PannellumWrapper = styled.div`
  position: relative;
  height: ${({ wrapperHeight }) => wrapperHeight || '0px'};
  ${({ isFullScreenWidth }) =>
    isFullScreenWidth
      ? `
    width: 100vw;
    left: calc(50% - 50vw);
  `
      : `
    width: 100%;
  `}
`

const Caption = styled.figcaption`
  font-size: 14px;
  ine-height: 1.8;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 12px;
  @media (min-width: 768px) {
    margin-top: 20px;
  }
  ${({ isFullScreenWidth }) =>
    isFullScreenWidth &&
    `
    text-align: center;
  `}
`

const Error = styled.div`
  width: 100%;
  height: 100%;
  color: red;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EditorWrapper = styled.div`
  margin: 24px 0;
`

const EditorHint = styled.ul`
  color: #374151;
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  min-width: 120px;
  margin-bottom: 4px;
`

const EditorPanel = styled.textarea`
  max-width: 600px;
  height: 100px;
  border-color: #ccd1d5;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  background-color: #fafbfc;
  border-color: #e1e5e9;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  color: #374151;
  font-size: 1rem;
  line-height: 1.4;
  outline: 0;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 8px;
  resize: vertical;
  -webkit-transition: background-color 130ms, box-shadow 130ms,
    border-color 130ms;
  transition: background-color 130ms, box-shadow 130ms, border-color 130ms;
  width: 100%;
`

/**
 * @typedef {Object} ImageUrls
 * @property {string} pc
 * @property {string} mb
 */

/**
 *
 * @param {Object} props
 * @param {ImageUrls} props.imageRwdUrls - 360 image url
 * @param {import('./components/react-pannellum.js').Config} props.config -  config for 360 image
 * @param {string} props.caption - 360 image caption
 * @param {boolean} props.isFullScreenWidth - decide image width: true for '100vw', false for '100%
 * @param {boolean} props.isEditMode - show edit mode to help editor get the needed data like hotspot's pitch and yaw
 * @returns {React.JSX}
 */
export default function React360({
  imageRwdUrls,
  config,
  caption,
  isFullScreenWidth = true,
  isEditMode = false,
}) {
  console.log('config', config)
  const pannellumRef = useRef(null)
  const wrapperRef = useRef(null)
  const onceShown = useOnceShown(wrapperRef)
  const [hotspotData, setHotspotData] = useState({
    pitch: 0,
    yaw: 0,
    type: 'info',
    text: 'Change this to desired wording.',
    url: 'Add link or remove to prevent redirect',
  })
  const [showPannellumHint, setShowPannellumHint] = useState(false)

  const [imageHeight, setImageHeight] = useState(0)
  const [device, setDevice] = useState('mb')

  const imageUrl = imageRwdUrls[device]

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setImageHeight(window.innerHeight / 2)
      setDevice('mb')
    } else {
      setImageHeight(window.innerWidth / 2)
      setDevice('pc')
    }
  }, [])

  /**
   * @param {number} pitch
   * @param {number} yaw
   */
  const onEditorClick = (pitch, yaw) => {
    setHotspotData((pre) => ({ ...pre, pitch, yaw }))
  }

  return (
    <Wrapper ref={wrapperRef}>
      {isEditMode && (
        <>
          <EditorWrapper>
            <EditorHint>
              <li>目前 Config 主要有以下幾點設定：</li>
              <li>
                hotspots: 熱點資料，需要由下方的 360 image
                取得熱點資料，點擊圖片任一個點之後會取得該位置的資訊(顯示於下方
                textarea 中)，將該熱點資訊請複製到上方的 config.hotspots 的
                array [] 之中，可以修改 text 值(點擊/ hover 熱點會秀的文字)和
                url (點擊熱點後跳轉的連結)，若不需要跳轉請直接刪除 url 欄位。
              </li>
              <li>
                pitch:
                設定畫面初始上下的角度，可比照熱點設定方式取得pitch值來修改
                config.pitch 的值 (初始畫面會設定為該點的 pitch 值)
              </li>
              <li>
                yaw: 設定畫面初始左右的角度，可比照熱點設定方式取得yaw值來修改
                config.yaw 的值 (初始畫面會設定為該點的 yaw 值)
              </li>
              <li>
                showControls: 是否顯示控制，包含縮放控制和全螢幕模式的控制
              </li>
            </EditorHint>
            <EditorPanel
              value={JSON.stringify(hotspotData)}
              onChange={() => {}}
            ></EditorPanel>
          </EditorWrapper>
        </>
      )}
      <PannellumWrapper
        wrapperHeight={`${imageHeight}px`}
        isFullScreenWidth={isFullScreenWidth}
      >
        {!imageUrl ? (
          <Error>No Image Url Provided! `{imageUrl}`</Error>
        ) : (
          onceShown && (
            <>
              <ReactPannellum
                ref={pannellumRef}
                imageUrl={imageUrl}
                config={config}
                onEditorClick={isEditMode ? onEditorClick : null}
                onClick={() => {
                  setShowPannellumHint(false)
                }}
                onPannellumLoaded={() => {
                  setShowPannellumHint(true)
                }}
              />
              <InteractionHint showHint={showPannellumHint} />
            </>
          )
        )}
      </PannellumWrapper>
      {caption && (
        <Caption isFullScreenWidth={isFullScreenWidth}>{caption}</Caption>
      )}
    </Wrapper>
  )
}
