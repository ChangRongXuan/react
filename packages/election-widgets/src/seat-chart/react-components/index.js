import styled from 'styled-components'
import { useMemo, useState } from 'react'
import SeatsSwitch from './switch'

const partiesColor = [
  {
    index: 1,
    name: '中國國民黨',
    colors: ['#183193', '#122F9A', '#3356D8', '#5478FF', '#89A2FF'],
  },
  {
    index: 2,
    name: '民主進步黨',
    colors: ['#18513B', '#165642', '#337C65', '#5CB096', '#80D4BA'],
  },
  {
    index: 3,
    name: '台灣民眾黨',
    colors: ['#0E879D', '#1BA2BF', '#47C1E3', '#80DDF1', '#AAF0FF'],
  },
  {
    index: 4,
    name: '時代力量',
    colors: ['#C88F00', '#DDA310', '#F9BE01', '#FFDA7B', '#FFE7A8'],
  },
  {
    index: 5,
    name: '台灣團結聯盟',
    colors: ['#633E09', '#693D00', '#AB6300', '#D28A27', '#F6BB6A'],
  },
  {
    index: 6,
    name: '社會民主黨',
    colors: ['#A7093B', '#C90D4C', '#E7316E', '#FA5F93', '#FF86AE'],
  },
  {
    index: 7,
    name: '勞動黨',
    colors: ['#8C1F18', '#9C241F', '#BC423D', '#D9716C', '#F6A39F'],
  },
  {
    index: 8,
    name: '親民黨',
    colors: ['#DF5609', '#E25100', '#F27C0E', '#FE9634', '#FFAF64'],
  },
  {
    index: 9,
    name: '台灣基進',
    colors: ['#77250E', '#952C11', '#A73F24', '#CE674C', '#DD856E'],
  },
  {
    index: 10,
    name: '新黨',
    colors: ['#DCC603', '#EFD915', '#FFF500', '#FFFA81', '#FFFCA9'],
  },
  {
    index: 11,
    name: '綠黨',
    colors: ['#3B920F', '#51C21C', '#77E046', '#9FFF73', '#69D437'],
  },
  {
    index: 12,
    name: '無黨團結聯盟',
    colors: ['#600000', '#92001A', '#C20F51', '#DF4981', '#D18DA6'],
  },
  {
    index: 998,
    name: '席次尚未確認',
    colors: ['#fff', '#fff', '#fff', '#fff', '#fff'],
  },
  {
    index: 999,
    name: '無黨籍',
    colors: ['#272727', '#4A4A4A', '#666666', '#818181', '#B1B1B1'],
  },
  {
    index: 1000,
    name: '其他政黨',
    colors: ['#634455', '#966982', '#958090', '#C3B4BD', '#E8DFE4'],
  },
]

const getPartyColor = (party) => {
  const color =
    partiesColor.find((partyColor) => party?.startsWith(partyColor.name))
      ?.colors[2] || partiesColor[partiesColor.length - 1].colors[2]
  return color
}

const SeatsChartWrapper = styled.div`
  font-size: 20px;
  line-height: 29px;
`

const SeatsChartYear = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  line-height: 120%;
  padding: 12px 0;
`

const SeatsChartTitle = styled.div`
  padding: 20px 0;
  text-align: center;
  background-color: #afafaf;
  font-weight: 700;
  line-height: 120%;
  padding: 12px 0;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
`

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 40px 39px 74px;
`

const SeatWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`

const Seat = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${/**
   *  @param {Object} props
   *  @param {string} props.bgColor
   */
  ({ bgColor }) => bgColor || '#fff'};
  border: solid 1px #000;
  border-radius: 50%;
`

const SeatInfo = styled.div`
  position: fixed;
  border-radius: 6px;
  max-width: 68px;
  padding: 4px;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  line-height: 17.8px;
  top: 501px;
  left: 91px;
  ${/**
   *  @param {Object} props
   *  @param {number[]} props.coordinate
   */
  ({ coordinate }) =>
    coordinate.length
      ? `
      top: ${coordinate[1]}px;
      left: ${coordinate[0]}px;
    `
      : `
        display: none;
    `}
`

const SeatsSwitchWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const SeatsSwitchOption = styled.span`
  font-size: 13px;
  ${/**
   * @param {Object} props
   * @param {boolean} props.isActive
   * */
  ({ isActive }) => isActive && `font-weight: 900;`}
`

function sortPartiesAndUndefinedParty(rawParties) {
  let parties = rawParties
  const undefinedPartyIndex = parties.findIndex(
    (party) => party.label === '席次尚未確認'
  )
  if (undefinedPartyIndex !== -1) {
    const undefinedParty = parties.splice(undefinedPartyIndex, 1)
    parties.sort((a, b) => b.seats - a.seats)
    parties.push(undefinedParty[0])
  } else {
    parties.sort((a, b) => b.seats - a.seats)
  }
  return parties
}

/**
 * @typedef {Object} Party
 * @property {string} label
 * @property {number} seats
 *
 * @typedef {Object} SeatData
 * @property {Array<Party>} parties
 *
 * @typedef {Object} SeatSwitchInfo
 * @property {boolean} isOn - state to indicate whether the switch is on or off.
 * @property {string} onText - text for switch on.
 * @property {string} offText - text for switch off.
 * @property {(value: boolean) => void} onChange - callback to send switch changed event.
 *
 * @typedef {Object} SeatMeta
 * @property {string} componentTitle - title used for seat chart.
 * @property {number} year - year to show on seat chart.
 * @property {SeatSwitchInfo} switchInfo - switch info to show related UI and callback.
 *
 *
 * This seat chart only takes input to render,
 * the logic of the data processed will stay outside of it.
 * @param {Object} props
 * @param {SeatData} props.data
 * @param {SeatMeta} props.meta
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function SeatsChart({ data, meta, className }) {
  const [hoverParty, setHoverParty] = useState({
    show: false,
    party: '',
    coordinate: [],
  })

  const parties = useMemo(() => {
    return sortPartiesAndUndefinedParty(
      data.parties && Array.isArray(data.parties) ? [...data.parties] : []
    )
  }, [data.parties])

  return (
    <SeatsChartWrapper className={className}>
      <SeatsChartYear>{meta.year}</SeatsChartYear>
      <SeatsChartTitle>{meta.componentTitle}</SeatsChartTitle>
      <Wrapper>
        {hoverParty.show && (
          <SeatInfo coordinate={hoverParty.coordinate}>
            {hoverParty.party}
          </SeatInfo>
        )}

        {meta.switchInfo && (
          <SeatsSwitchWrapper>
            <SeatsSwitchOption isActive={!meta.switchInfo.isOn}>
              {meta.switchInfo.onText}
            </SeatsSwitchOption>
            <SeatsSwitch
              isOn={meta.switchInfo.isOn}
              onChange={(switchOn) => {
                meta.switchInfo.onChange(switchOn)
              }}
            />
            <SeatsSwitchOption isActive={meta.switchInfo.isOn}>
              {meta.switchInfo.offText}
            </SeatsSwitchOption>
          </SeatsSwitchWrapper>
        )}
        {parties.reduce((total, party) => {
          const color = getPartyColor(party.label)
          return total.concat(
            [...Array(party.seats)].map((empty, i) => {
              return (
                <SeatWrapper
                  key={party.label + i}
                  onMouseOver={() => {
                    setHoverParty((value) => ({
                      ...value,
                      show: true,
                      party: party.label,
                    }))
                  }}
                  onMouseMove={(e) => {
                    setHoverParty((value) => ({
                      ...value,
                      coordinate: [e.clientX + 15, e.clientY],
                    }))
                  }}
                  onMouseLeave={() => {
                    setHoverParty({
                      show: false,
                      party: '',
                      coordinate: [],
                    })
                  }}
                >
                  <Seat bgColor={color} />
                </SeatWrapper>
              )
            })
          )
        }, [])}
      </Wrapper>
    </SeatsChartWrapper>
  )
}
