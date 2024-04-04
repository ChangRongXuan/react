import React from 'react' // eslint-disable-line
import Theatre from '../src/react-components/index.js'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const objectJson = [
  {
    id: 'bgVideo-001',
    src: 'https://www.twreporter.org/videos/2020092015-tnrail-01-1280.mp4',
    type: 'BGVIDEO',
  },
]

const animateJson = {
  sheetsById: {},
  revisionHistory: [],
  definitionVersion: '0.4.0',
}

const mobileObjectJson = [
  {
    id: 'bgVideo-001',
    src:
      'https://storage.googleapis.com/statics-readr-tw-dev/files/final1-mobile-s-e51m-l-yv6-r96bt4m-i-gqb-Vyj7ghLTi4ckRkB2agIV.mp4',
    type: 'BGVIDEO',
  },
]
const mobileAnimateJson = {
  sheetsById: {
    Scene: {
      sequence: {
        type: 'PositionalSequence',
        length: 42,
        tracksByObject: {
          'video-001': {
            trackData: {
              '4f2v0wVXtc': {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["opacity"]',
              },
              '4wnceiBFln': {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["size","width"]',
              },
              '5pg5ddG1a4': {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["isLoop"]',
              },
              Ky3u4LDPZY: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["size","height"]',
              },
              XvxvjCTxzO: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["position","x"]',
              },
              YgvUZKhrEq: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["scale"]',
              },
              cIIZ5IC0me: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["visible"]',
              },
              cJBIUnUdLE: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["zIndex"]',
              },
              dXnJhz7Bcs: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["isPlaying"]',
              },
              yT_c0k57uO: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'video-001:["position","y"]',
              },
            },
            trackIdByPropPath: {
              '["scale"]': 'YgvUZKhrEq',
              '["isLoop"]': '5pg5ddG1a4',
              '["zIndex"]': 'cJBIUnUdLE',
              '["opacity"]': '4f2v0wVXtc',
              '["visible"]': 'cIIZ5IC0me',
              '["isPlaying"]': 'dXnJhz7Bcs',
              '["position","x"]': 'XvxvjCTxzO',
              '["position","y"]': 'yT_c0k57uO',
              '["size","width"]': '4wnceiBFln',
              '["size","height"]': 'Ky3u4LDPZY',
            },
          },
          'bgVideo-001': {
            trackData: {
              '6DwHy_UGtE': {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["zIndex"]',
              },
              B_EFJv7gvl: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["position","y"]',
              },
              C6qNMFZdze: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["scale"]',
              },
              Qf4AgP2gAm: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["size","height"]',
              },
              QgE6k4ePNm: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["size","width"]',
              },
              T9aQXOS8e2: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["visible"]',
              },
              pveazYDRB1: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["opacity"]',
              },
              zALh_D05ZD: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["speed"]',
              },
              zNKR38kAzE: {
                type: 'BasicKeyframedTrack',
                keyframes: [],
                __debugName: 'bgVideo-001:["position","x"]',
              },
            },
            trackIdByPropPath: {
              '["scale"]': 'C6qNMFZdze',
              '["speed"]': 'zALh_D05ZD',
              '["zIndex"]': '6DwHy_UGtE',
              '["opacity"]': 'pveazYDRB1',
              '["visible"]': 'T9aQXOS8e2',
              '["position","x"]': 'zNKR38kAzE',
              '["position","y"]': 'B_EFJv7gvl',
              '["size","width"]': 'QgE6k4ePNm',
              '["size","height"]': 'Qf4AgP2gAm',
            },
          },
        },
        subUnitsPerUnit: 30,
      },
      staticOverrides: {
        byObject: {
          'video-001': {
            size: {
              width: 466,
              height: 735,
            },
          },
          'bgVideo-001': {
            size: {
              width: 100,
              height: 100,
            },
            scale: 1,
            speed: 500,
            zIndex: '10',
            opacity: 1,
            visible: true,
            position: {
              x: 50,
              y: 50.11834319526627,
            },
          },
        },
      },
    },
  },
  revisionHistory: [],
  definitionVersion: '0.4.0',
}

root.render(
  <Theatre
    objectJson={objectJson}
    animateJson={animateJson}
    mobileObjectJson={mobileObjectJson}
    mobileAnimateJson={mobileAnimateJson}
    type="scroll"
  />
)
