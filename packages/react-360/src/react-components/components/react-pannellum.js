import { forwardRef } from 'react'
import { Pannellum } from '@readr-media/pannellum-react'

/**
 * @typedef {Object} Hotspot
 * @property {number} pitch
 * @property {number} yaw
 * @property {string} type
 * @property {string} url
 */

/**
 * @typedef {Object} Config
 * @property {Hotspot[]} hotspots
 * @property {number} pitch
 * @property {number} yaw
 * @property {boolean} showControls
 */

/** @type {Config} */
const defaultConfig = {
  hotspots: [],
  pitch: 0,
  yaw: 0,
  showControls: false,
}

/**
 * @returns {Config}
 */
function scanAndAutoFixConfig(config) {
  if (!config) {
    console.error('react 360 receive no config, use default config', config)
    return defaultConfig
  }

  const newConfig = Object.keys(defaultConfig).reduce((acc, currKey) => {
    const configValue = config[currKey]
    if (typeof configValue === 'undefined') {
      const defaultConfigValue = defaultConfig[currKey]
      console.error(
        `react 360 receive config without ${currKey} value, set to default ${defaultConfigValue}`
      )
      acc[currKey] = defaultConfigValue
    } else {
      acc[currKey] = configValue
    }
    return acc
  }, {})
  return newConfig
}

export default forwardRef(
  /**
   * @param {Object} props
   * @param {string} props.imageUrl
   * @param {Config} props.config
   * @param {Function} props.onEditorClick
   * @param {Function} props.onClick
   * @param {Function} props.onPannellumLoaded
   * @param {React.MutableRefObject} ref
   * @returns {React.ReactElement}
   */
  function ReactPannellum(props, ref) {
    const {
      imageUrl,
      config,
      onEditorClick,
      onClick,
      onPannellumLoaded,
    } = props

    const validatedConfig = scanAndAutoFixConfig(config)
    const { hotspots, pitch, yaw, showControls } = validatedConfig

    return (
      <Pannellum
        ref={ref}
        width="100%"
        height="100%"
        image={imageUrl}
        pitch={pitch}
        yaw={yaw}
        hfov={100}
        autoLoad
        showControls={showControls}
        mouseZoom={false}
        onLoad={onPannellumLoaded}
        onMousedown={(e) => {
          if (onEditorClick) {
            // Calculate the pitch and yaw based on the click coordinates
            const viewer = ref.current.getViewer()
            const pitchYaw = viewer.mouseEventToCoords(e)
            const [pitch, yaw] = pitchYaw
            onEditorClick(pitch, yaw)
          }
          onClick()
        }}
        onTouchstart={() => {
          onClick()
        }}
      >
        {hotspots.map((hotspot) => (
          <Pannellum.Hotspot
            key={`${hotspot.text}_${hotspot.pitch}_${hotspot.yaw}`}
            type={hotspot.type}
            pitch={hotspot.pitch}
            yaw={hotspot.yaw}
            text={hotspot.text}
            URL={hotspot.url}
          />
        ))}
      </Pannellum>
    )
  }
)
