// Responsibility: API calls for biometric device management

import { api } from "../lib/api";
import type {
  BiometricDevice,
  CreateDeviceInput,
  EmployeePinMapping,
  CreatePinMappingInput,
} from "../types/biometric";

export const biometricService = {
  // Device management
  async getDevices(hospitalId: string): Promise<BiometricDevice[]> {
    const response = await api.get(
      `/hospitals/${hospitalId}/biometric/devices`,
    );
    return response.data;
  },

  async getDevice(
    hospitalId: string,
    deviceId: string,
  ): Promise<BiometricDevice> {
    const response = await api.get(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}`,
    );
    return response.data;
  },

  async createDevice(
    hospitalId: string,
    data: CreateDeviceInput,
  ): Promise<BiometricDevice> {
    const response = await api.post(
      `/hospitals/${hospitalId}/biometric/devices`,
      data,
    );
    return response.data;
  },

  async updateDevice(
    hospitalId: string,
    deviceId: string,
    data: Partial<CreateDeviceInput>,
  ): Promise<BiometricDevice> {
    const response = await api.patch(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}`,
      data,
    );
    return response.data;
  },

  async updateDeviceStatus(
    hospitalId: string,
    deviceId: string,
    status: BiometricDevice["status"],
  ): Promise<BiometricDevice> {
    const response = await api.patch(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}/status`,
      { status },
    );
    return response.data;
  },

  async deleteDevice(hospitalId: string, deviceId: string): Promise<void> {
    await api.delete(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}`,
    );
  },

  // PIN mappings
  async getPinMappings(hospitalId: string): Promise<EmployeePinMapping[]> {
    const response = await api.get(
      `/hospitals/${hospitalId}/biometric/pin-mappings`,
    );
    return response.data;
  },

  async createPinMapping(
    hospitalId: string,
    data: CreatePinMappingInput,
  ): Promise<EmployeePinMapping> {
    const response = await api.post(
      `/hospitals/${hospitalId}/biometric/pin-mappings`,
      data,
    );
    return response.data;
  },

  async updatePinMapping(
    hospitalId: string,
    mappingId: string,
    biometricPin: string,
  ): Promise<EmployeePinMapping> {
    const response = await api.patch(
      `/hospitals/${hospitalId}/biometric/pin-mappings/${mappingId}`,
      { biometric_pin: biometricPin },
    );
    return response.data;
  },

  async deletePinMapping(
    hospitalId: string,
    mappingId: string,
  ): Promise<void> {
    await api.delete(
      `/hospitals/${hospitalId}/biometric/pin-mappings/${mappingId}`,
    );
  },
};
