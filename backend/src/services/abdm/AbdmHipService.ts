// Responsibility: HIP data push - orchestrate FHIR bundle build and gateway transmission

import config from "../../config/env";
import { AbdmAuth } from "./AbdmAuth";
import { FhirBundleBuilder } from "./fhir/FhirBundleBuilder";
import { FhirEncryptionService } from "./fhir/FhirEncryptionService";
import { HipDataFetcher } from "./fhir/HipDataFetcher";

const { gatewayUrl, hipId } = config.abdm;

export class AbdmHipService {
  private auth: AbdmAuth;
  private bundleBuilder: FhirBundleBuilder;

  constructor() {
    this.auth = new AbdmAuth();
    this.bundleBuilder = new FhirBundleBuilder(hipId);
  }

  async pushHealthInformation(
    consentArtifactId: string,
    transactionId: string,
  ): Promise<void> {
    const consent =
      await HipDataFetcher.fetchConsentArtifact(consentArtifactId);
    if (!consent) throw new Error("Consent artifact not found");

    const hospitalId = consent.hospital_id;

    const patientData = await HipDataFetcher.fetchPatientData(
      consent.patient_id,
      hospitalId,
    );
    if (!patientData) throw new Error("Patient data not found");

    const encounterData = await HipDataFetcher.fetchLatestEncounter(
      consent.patient_id,
      hospitalId,
    );
    const prescriptionData = encounterData
      ? await HipDataFetcher.fetchPrescriptionItems(
          encounterData.id,
          hospitalId,
        )
      : [];
    const labData = encounterData
      ? await HipDataFetcher.fetchLabData(encounterData.id, hospitalId)
      : null;

    const fhirBundle = this.bundleBuilder.buildBundle({
      patient: patientData as unknown as Parameters<
        typeof import("./fhir/PatientBuilder").PatientBuilder.build
      >[0],
      encounter: encounterData || undefined,
      prescriptionItems: prescriptionData,
      labOrder: labData?.order,
      labResults: labData?.results || [],
    });

    const bundleJson = JSON.stringify(fhirBundle);
    const encrypted = FhirEncryptionService.encrypt(
      bundleJson,
      consent.hiu_public_key || "",
    );

    await this.sendToGateway(transactionId, consent.artifact_id, encrypted);
  }

  private async sendToGateway(
    transactionId: string,
    consentArtifactId: string,
    encrypted: ReturnType<typeof FhirEncryptionService.encrypt>,
  ): Promise<void> {
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, hipId);

    const response = await fetch(
      `${gatewayUrl}/v0.5/health-information/hip/on-request`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          transactionId,
          consentId: consentArtifactId,
          entries: [encrypted],
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Gateway rejected HIP data push: ${response.status} ${errorBody}`,
      );
    }
  }
}
