// Responsibility: Unified facade for ABDM integration services
//
// SCAFFOLD -- read docs/PHASE5_ABDM_INTEGRATION.md before touching this.
// Rule 15 Compliance: Uses centralized env config
// Rule 20 Compliance: Under 100 lines via extraction to milestone-specific services

const { AbdmM1Service } = require("./abdm/AbdmM1Service");
const { AbdmM2Service } = require("./abdm/AbdmM2Service");
const { AbdmM3Service } = require("./abdm/AbdmM3Service");

class AbdmClient {
  constructor() {
    this.m1 = new AbdmM1Service();
    this.m2 = new AbdmM2Service();
    this.m3 = new AbdmM3Service();
  }

  // --- M1: ABHA verification and linking ---

  /**
   * Initiate ABHA verification (OTP-based)
   * @param {Object} params
   * @param {string} params.abhaAddress
   * @param {string} params.hospitalId
   * @param {string} params.patientId
   * @returns {Promise<Object>} Contains transactionId
   */
  async initiateAbhaVerification({ abhaAddress, hospitalId, patientId }) {
    return this.m1.initiateAbhaVerification({ abhaAddress });
  }

  /**
   * Confirm ABHA link with OTP
   * @param {Object} params
   * @param {string} params.transactionId
   * @param {string} params.otp
   * @returns {Promise<Object>}
   */
  async confirmAbhaLink({ transactionId, otp }) {
    return this.m1.confirmAbhaLink({ transactionId, otp });
  }

  // --- M2: Care context linking ---

  /**
   * Link encounter/admission to patient's ABHA
   * @param {Object} params
   * @param {string} params.abhaAddress
   * @param {string} params.hospitalId
   * @param {string} params.encounterId
   * @param {string} params.careContextReference
   * @returns {Promise<Object>}
   */
  async linkCareContext({
    abhaAddress,
    hospitalId,
    encounterId,
    careContextReference,
  }) {
    return this.m2.linkCareContext({ abhaAddress, careContextReference });
  }

  // --- M3: Consent and health information (HIU role) ---

  /**
   * Request consent to view patient's health records
   * @param {Object} params
   * @param {string} params.abhaAddress
   * @param {string} params.purpose
   * @param {string} params.hospitalId
   * @returns {Promise<Object>}
   */
  async requestConsent({ abhaAddress, purpose, hospitalId }) {
    return this.m3.requestConsent({ abhaAddress, purpose });
  }

  /**
   * Fetch health information after consent granted
   * @param {Object} params
   * @param {string} params.artifactId
   * @returns {Promise<Object>} FHIR R4 bundle
   */
  async fetchHealthInformation({ artifactId }) {
    return this.m3.fetchHealthInformation({ artifactId });
  }
}

module.exports = { AbdmClient };
