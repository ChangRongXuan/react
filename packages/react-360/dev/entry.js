import React from 'react' // eslint-disable-line
import React360 from '../src/react-components/index.js'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const hotspotsConfig = [
  {
    type: 'info',
    pitch: 0,
    yaw: 0,
    text: 'this is a hotspot',
    url: 'https://www.google.com',
  },
]

/** @type {import('../src/react-components/components/react-pannellum.js').Config}  */
const config = {
  hotspots: hotspotsConfig,
  pitch: 0,
  yaw: 0,
  showControls: true,
}

root.render(
  <>
    <div style={{ height: '200vh', background: 'blue' }} />
    <React360
      imageRwdUrls={{
        pc:
          'https://editools-gcs-dev.readr.tw/images/4710eb66-7d53-4d98-a02f-b1be247505c3.webP',
        mb:
          'https://editools-gcs-dev.readr.tw/images/4710eb66-7d53-4d98-a02f-b1be247505c3-w2400.webP',
      }}
      config={config}
      caption="some paragraph of caption to describe 360 images"
      isFullScreenWidth={false}
      isEditMode={true}
    />

    <React360
      imageRwdUrls={{
        pc:
          'https://editools-gcs-dev.readr.tw/images/4710eb66-7d53-4d98-a02f-b1be247505c3.webP',
        mb:
          'https://editools-gcs-dev.readr.tw/images/4710eb66-7d53-4d98-a02f-b1be247505c3-w1600.webP',
      }}
      config={config}
      caption="some paragraph of caption to describe 360 images"
      isFullScreenWidth={false}
    />

    <React360
      imageRwdUrls={{
        pc:
          'https://editools-gcs-dev.readr.tw/images/4710eb66-7d53-4d98-a02f-b1be247505c3.webP',
        mb:
          'https://editools-gcs-dev.readr.tw/images/4710eb66-7d53-4d98-a02f-b1be247505c3-w800.webP',
      }}
      config={config}
      caption="some paragraph of caption to describe 360 images"
      isFullScreenWidth={false}
    />
  </>
)
