export default {}

/**
 *  @typedef {Object} Entity
 *  @property {string} label
 *  @property {string} [href]
 *  @property {string} [imgSrc]
 */

/**
 *  @typedef {Object} Candidate
 *  @property {Entity} name
 *  @property {Entity} party
 *  @property {number} [number]
 *  @property {string} [candNo]
 *  @property {number} [votes]
 *  @property {number} [voteRate]
 *  @property {boolean} [elected]
 *  @property {number} [tks]
 *  @property {number} [tksRate]
 *  @property {number} [candVictor]
 */

/**
 *  @typedef {Object} District
 *  @property {Candidate[]} candidates
 *  @property {string} districtName
 *  @property {string} [fullDistrictName]
 *  @property {string} [type] - value could be 'normal', 'plainIndigenous', 'mountainIndigenous' or 'indigenous'
 */

/**
 *  @typedef {Object} Election
 *  @property {string} title
 *  @property {string} year
 *  @property {'councilMember'|'mayor'|'legislator'} [type]
 *  @property {District[]} [districts]
 */

/**
 *  @typedef {Election} CouncilMemberElection
 */

/**
 *  @typedef {Election} CountyMayorElection
 */

/**
 *  @typedef {Object} PresidentCandidate
 *  @property {string} candNo
 *  @property {Entity[]} names
 *  @property {Entity[]} parties
 *  @property {number} tks
 *  @property {number} tksRate
 *  @property {boolean} candVictor
 */

/**
 *  @typedef {Object} PresidentElection
 *  @property {string} title
 *  @property {string} year
 *  @property {'president'} type
 *  @property {PresidentCandidate[]} candidates
 */

/**
 *  @typedef {Object} LegislatorElection
 *  @property {string} title
 *  @property {string} year
 *  @property {'legislator' | 'legislator-district'} [type]
 *  @property {District[]} [districts]
 */

/**
 *  @typedef {Object} LegislatorParty
 *  @property {string} candNo
 *  @property {Entity} party
 *  @property {number} tks
 *  @property {number} tksRate1 //第一階段得票率
 *  @property {number} tksRate2 //第二階段得票率
 *  @property {number} seats
 */

/**
 *  @typedef {Object} LegislatorPartyElection
 *  @property {string} title
 *  @property {string} year
 *  @property {'legislator-party'} type
 *  @property {LegislatorParty[]} parties
 */

/**
 *  @typedef {Object} LegislatorCandidate
 *  @property {string} candNo
 *  @property {Entity} name
 *  @property {Entity} party
 *  @property {number} tks
 *  @property {number} tksRate
 *  @property {boolean} candVictor
 */

/**
 *  @typedef {Object} LegislatorIndigenousElection
 *  @property {string} title
 *  @property {string} year
 *  @property {'legislator-mountainIndigenous' | 'legislator-plainIndigenous'} type
 *  @property {LegislatorCandidate[]} candidates
 */

/**
 *  @typedef {Object} Proposition
 *  @property {string} no - 案號
 *  @property {string} content - 案名
 *  @property {string} planner - 領銜人
 *  @property {number} agreeTks - 同意數
 *  @property {number} agreeRate - 同意率
 *  @property {number} disagreeTks - 不同意數
 *  @property {number} disagreeRate - 不同意率
 *  @property {boolean} pass - 是否通過
 */

/**
 *  @typedef {Object} ReferendumElection
 *  @property {string} title
 *  @property {string} year
 *  @property {'referendum'} type
 *  @property {Proposition[]} propositions
 */
