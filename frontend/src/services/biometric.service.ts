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
    return api.get<BiometricDevice[]>(
      `/hospitals/${hospitalId}/biometric/devices`,
    );
  },

  async getDevice(
    hospitalId: string,
    deviceId: string,
  ): Promise<BiometricDevice> {
    return api.get<BiometricDevice>(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}`,
    );
  },

  async createDevice(
    hospitalId: string,
    data: CreateDeviceInput,
  ): Promise<BiometricDevice> {
    return api.post<BiometricDevice>(
      `/hospitals/${hospitalId}/biometric/devices`,
      data,
    );
  },

  async updateDevice(
    hospitalId: string,
    deviceId: string,
    data: Partial<CreateDeviceInput>,
  ): Promise<BiometricDevice> {
    return api.patch<BiometricDevice>(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}`,
      data,
    );
  },

  async updateDeviceStatus(
    hospitalId: string,
    deviceId: string,
    status: BiometricDevice["status"],
  ): Promise<BiometricDevice> {
    return api.patch<BiometricDevice>(
      `/hospitals/${hospitalId}/biometric/devices/${deviceId}/status`,
      { status },
    );
  },

  async deleteDevice(hospitalId: string, deviceId: string): Promise<void> {
    await api.delete(`/hospitals/${hospitalId}/biometric/devices/${deviceId}`);
  },

  // PIN mappings
  async getPinMappings(hospitalId: string): Promise<EmployeePinMapping[]> {
    return api.get<EmployeePinMapping[]>(
      `/hospitals/${hospitalId}/biometric/pin-mappings`,
    );
  },

  async createPinMapping(
    hospitalId: string,
    data: CreatePinMappingInput,
  ): Promise<EmployeePinMapping> {
    return api.post<EmployeePinMapping>(
      `/hospitals/${hospitalId}/biometric/pin-mappings`,
      data,
    );
  },

  async updatePinMapping(
    hospitalId: string,
    mappingId: string,
    biometricPin: string,
  ): Promise<EmployeePinMapping> {
    return api.patch<EmployeePinMapping>(
      `/hospitals/${hospitalId}/biometric/pin-mappings/${mappingId}`,
      { biometric_pin: biometricPin },
    );
  },

  async deletePinMapping(hospitalId: string, mappingId: string): Promise<void> {
    await api.delete(
      `/hospitals/${hospitalId}/biometric/pin-mappings/${mappingId}`,
    );
  },
};
