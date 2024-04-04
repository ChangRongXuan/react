import axios from 'axios'
import errors from '@twreporter/errors'

/**
 *  @typedef {Object} SeatData
 *  @property {{label: string, seats: number}[]} parties
 */

export default class Loader {
  apiUrl = 'https://whoareyou-gcs.readr.tw/elections'

  /**
   *  @constructor
   *  @param {Object} props
   *  @param {string} [props.apiUrl='https://whoareyou-gcs.readr.tw']
   */
  constructor({ apiUrl = 'https://whoareyou-gcs.readr.tw/elections' }) {
    this.apiUrl = apiUrl
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @param {string} props.type
   *  @param {string} props.filename
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  async loadData({ year, type, filename }) {
    try {
      const axiosRes = await axios.get(
        `${this.apiUrl}/${year}/${type}/${filename}`
      )
      return axiosRes?.data
    } catch (err) {
      const annotatedErr = errors.helpers.annotateAxiosError(err)
      throw annotatedErr
    }
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @param {string} props.countyCode - county code, see `Loader.countyCodes` for more info
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  loadCouncilMemberData({ year, countyCode }) {
    return this.loadData({
      type: 'councilMember',
      year,
      filename: `seat/county/${countyCode}.json`,
    })
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @param {string} props.countyCode - county code, see `Loader.countyCodes` for more info
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  loadAreaLegislatorData({ year, countyCode }) {
    return this.loadData({
      type: 'legislator',
      year,
      filename: `seat/county/normal/${countyCode}.json`,
    })
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @param {string} props.countyCode - county code, see `Loader.countyCodes` for more info
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  loadAllLegislatorData({ year }) {
    return this.loadData({
      type: 'legislator',
      year,
      filename: `seat/country/all/country.json`,
    })
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  loadMountainIndigenousLegislatorData({ year }) {
    return this.loadData({
      type: 'legislator',
      year,
      filename: `seat/country/mountain-indigenous/country.json`,
    })
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  loadPlainIndigenousLegislatorData({ year }) {
    return this.loadData({
      type: 'legislator',
      year,
      filename: `seat/country/plain-indigenous/country.json`,
    })
  }

  /**
   *  Load data from web service.
   *  @param {Object} props
   *  @param {string} props.year
   *  @throws Error
   *  @returns {Promise<SeatData>}
   */
  loadPartyLegislatorData({ year }) {
    return this.loadData({
      type: 'legislator',
      year,
      filename: `seat/country/party/country.json`,
    })
  }
}

Loader.electionTypes = [
  'councilMember', // 縣市議員
]
Loader.electionYears = ['2014', '2018', '2022']
Loader.countyCodes = [
  '09007', // 連江縣
  '09020', // 金門縣
  '10002', // 宜蘭縣
  '10004', // 新竹縣
  '10005', // 苗栗縣
  '10007', // 彰化縣
  '10008', // 南投縣
  '10009', // 雲林縣
  '10010', // 嘉義縣
  '10013', // 屏東縣
  '10014', // 台東縣
  '10015', // 花蓮縣
  '10016', // 澎湖縣
  '10017', // 基隆市
  '10018', // 新竹市
  '10020', // 嘉義市
  '63000', // 台北市
  '64000', // 高雄市
  '65000', // 新北市
  '66000', // 台中市
  '67000', // 台南市
  '68000', // 桃園市
]
