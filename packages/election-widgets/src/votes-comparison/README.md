# [@readr-media/react-election-widgets](https://www.npmjs.com/package/@readr-media/react-election-widgets) &middot; ![npm version](https://img.shields.io/npm/v/@readr-media/react-election-widgets.svg?style=flat)

## How to Use This Pkg?

### Data Loaders

`DataLoader` class 可以撈取多種不同選舉的結果，和執行一次性資料撈取或是週期性資料撈取。
目前支援的選舉類型（`type`）包括：

- `councilMember`：縣市議員
- `mayor`: 縣市長
- `president`: 總統
- `referendum`: 公投
- `legislator`: 立法委員（包含：區域/平地原住民/山地原住民/不分區政黨）

年份（`year`）的部分，根據不同的選舉類型，有不同的選舉年份。
目前支援的年份包括：

- 1994
- 1997
- 1998
- 2001
- 2002
- 2005
- 2006
- 2009
- 2010
- 2014
- 2018
- 2022
- 2024

然而，因為每種選舉的資料維度不盡相同，
所以在使用 `DataLoader` 時，需要提供「區域」（`district`）。

1. 「縣市議員」和「立法委員（區域）」可以提供的區域包含：

- `taipeiCity`
- `newTaipeiCity`
- `taoyuanCity`
- `taichungCity`
- `tainanCity`
- `kaohsiungCity`
- `hsinchuCounty`
- `miaoliCounty`
- `changhuaCounty`
- `nantouCounty`
- `yunlinCounty`
- `chiayiCounty`
- `pingtungCounty`
- `yilanCounty`
- `hualienCounty`
- `taitungCounty`
- `penghuCounty`
- `kinmenCounty`
- `lienchiangCounty`
- `keelungCity`
- `hsinchuCity`
- `chiayiCity`

1. 其餘選舉類型的區域皆為 `all`：

- 縣市長
- 總統
- 公投
- 立法委員（平地原住民）
- 立法委員（山地原住民）
- 立法委員（不分區）

範例：

```
import evc from '@readr-media/react-election-votes-comparison'
const DataLoader = evc.DataLoader

let ldr

// 抓取「2018 年台北市議員」選舉結果
ldr = new DataLoader({
  type: 'councilMember',
  year: '2018',
  district: 'taipeiCity',
})
const data = await ldr.loadData()

// 抓取「2020 年總統」選舉結果
ldr = new DataLoader({
  type: 'president',
  year: '2020',
  district: 'all',
})
const data = await ldr.loadData()

// 抓取「2020 年不分區立法委員」選舉結果
ldr = new DataLoader({
  type: 'legislator',
  subtype: 'party'
  year: '2020',
  district: 'all',
})
const data = await ldr.loadData()

// 抓取「2022 年公投」選舉結果
ldr = new DataLoader({
  type: 'referendum',
  year: '2022',
  district: 'all',
})
const data = await ldr.loadData()
```

#### 週期性抓取資料

`DataLoader` 除了 `loadData` method 可以使用，亦可以使用 `loadDataPeriodically` method。
該 method 會解析 response header 中的 `Cache-Control`，將 `max-age` 的值抓出來，當作下一次 request 的 timer。
如果 `max-age` 不存在，則 timer 會設定為一個小時。

註：
目前沒有處理 `no-store`，如果有需要，需要再補邏輯。

範例：

```
// anotherComponent.jsx

import EVC from '@readr-media/react-election-votes-comparison'

const DataLoader = EVC.DataLoader
const EVCComponent = EVC.ReactComponent.EVC

function AnotherComponent(props) {
   const [data, setData] = useState({})

   useEffect(() => {
    let dataLoader = new DataLoader({
      year: '2018', // 年份
      type: 'councilMember', // 選舉類型
      district: 'taipeiCity', // 縣市
    })

    const handleError = (errMsg, errObj) => {
      // do something for loading error
    }

    const handleData = (data) => {
      // call React component `setState`
      setState(data)
    }

    dataLoader.addEventListener('error', handleError)
    dataLoader.addEventListener('data', setState)

    // after register event listener
    // start to load data periodically
    dataLoader.loadDataPeriodically()

    return () => {
      dataLoader.removeEventListener('error', handleError)
      dataLoader.removeEventListener('data', setState)
      dataLoader = null
    }
  }, [])

  return (
    <EVCComponent
      election={data}
      device="rwd" // value could be 'rwd' or 'mobile'
    />
  )
}
```

### React Components

`EVC` component 的 UI 是參考下面 mockups 實作：

- [關係人物資料庫的「單一選舉頁」](https://www.figma.com/file/mgcPrmGquqpuaIREKsoTt4/20220926_%E9%97%9C%E4%BF%82%E4%BA%BA%E7%89%A9%E8%B3%87%E6%96%99%E5%BA%AB?node-id=60%3A5435)
- [選舉模板中的「票數比較」](https://www.figma.com/file/O5VSZT8VVEpnqyGVcD5to5/%E9%81%B8%E8%88%89%E6%A8%A1%E6%9D%BF?node-id=835%3A2)

使用上僅需將 `DataLoader` 抓取回來的資料丟入 `EVC` 的 `election` prop 即可。
由於選舉模板的票數比較的 mockup，需要 `EVC` 可以強制 render mobile 版本，
所以在 `EVC` props 上，提供了 `device` prop 給使用者。
當 `device="mobile"` 時，`EVC` 會強制呈現 mobile 版本；當 `device="rwd"`（預設）時，
`EVC` 會根據 media query 來決定要 render 哪個版本。

Sample codes:

```
import evc from '@readr-media/react-election-votes-comparison'
const DataLoader = evc.DataLoader
const EVCComponent = evc.ReactComponent.EVC

async function load() {
  const dataLoader = new DataLoader({
    year: '2018', // 年份
    type: 'councilMember', // 選舉類型
    district: 'taipeiCity', // 縣市
  })

  let data
  try {
    // fetch data once
    data =  await dataLoader.loadData()
  } catch(err) {
    // handle error
  }
  return data
}

function renderComponent(data) {
  return (
    <EVCComponent
      election={data}
      device="rwd" // value could be 'rwd' or 'mobile'
    />
  )
}
```

## Installation

`yarn install`

## Development

```
$ yarn dev
// or
$ npm run dev
// or
$ make dev
```

## Build (Transpile React, ES6 Codes to ES5)

```
$ npm run build
// or
$ make build
```

### NPM Publish

After executing `Build` scripts, we will have `./dist` and `/lib` folders,
and then we can execute publish command,

```
npm publish
```

Note: before publish npm package, we need to bump the package version first.

## TODOs

- [ ] 建立 CI pipeline，透過 CI 產生 npm package，並且上傳至 npm registry
- [ ] 透過 Lerna 控制 packages 之間的版號
