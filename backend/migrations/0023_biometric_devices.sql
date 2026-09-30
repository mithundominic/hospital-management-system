-- Migration 0023: Biometric Device Integration
-- Adds support for ZKTeco biometric attendance devices via ADMS push protocol.
--
-- Deliberate calls:
--  - biometric_devices.serial_number is UNIQUE across all hospitals to prevent
--    the same physical device from being registered multiple times.
--  - employee_pin_mappings has UNIQUE constraints on (hospital_id, biometric_pin)
--    and (hospital_id, user_id) to ensure one-to-one mapping per hospital.
--  - attendance_records.source defaults to 'manual' for backward compatibility.
--  - attendance_records.device_id is nullable - NULL for manual entries.
--  - New permission 'devices.manage' is granted only to HospitalAdmin for
--    managing biometric devices and employee PIN mappings.
--  - Webhook endpoint /api/biometric/webhook bypasses normal auth (follows
--    Rule 9: Auth Exceptions pattern) but validates device serial_number.

-- ============================================================================
-- Biometric Devices Table
-- ============================================================================

CREATE TABLE biometric_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    serial_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    location TEXT,
    model TEXT,
    ip_address TEXT,
    firmware_version TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (status IN ('active', 'inactive', 'maintenance'))
);

CREATE INDEX idx_biometric_devices_hospital ON biometric_devices(hospital_id);
CREATE INDEX idx_biometric_devices_serial ON biometric_devices(serial_number);
CREATE INDEX idx_biometric_devices_status ON biometric_devices(status, hospital_id);

ALTER TABLE biometric_devices ENABLE ROW LEVEL SECURITY;

-- Users with attendance.read can view all devices in their hospital
CREATE POLICY biometric_devices_select ON biometric_devices
    FOR SELECT USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'attendance.read')
    );

-- Only users with devices.manage permission can modify devices
CREATE POLICY biometric_devices_insert ON biometric_devices
    FOR INSERT WITH CHECK (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'devices.manage')
    );

CREATE POLICY biometric_devices_update ON biometric_devices
    FOR UPDATE USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'devices.manage')
    );

CREATE POLICY biometric_devices_delete ON biometric_devices
    FOR DELETE USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'devices.manage')
    );

-- ============================================================================
-- Employee PIN Mappings Table
-- ============================================================================

CREATE TABLE employee_pin_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    biometric_pin TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(hospital_id, biometric_pin),
    UNIQUE(hospital_id, user_id)
);

CREATE INDEX idx_employee_pin_mappings_hospital ON employee_pin_mappings(hospital_id);
CREATE INDEX idx_employee_pin_mappings_user ON employee_pin_mappings(user_id);
CREATE INDEX idx_employee_pin_mappings_pin ON employee_pin_mappings(hospital_id, biometric_pin);

ALTER TABLE employee_pin_mappings ENABLE ROW LEVEL SECURITY;

-- Users with attendance.read can view PIN mappings
CREATE POLICY employee_pin_mappings_select ON employee_pin_mappings
    FOR SELECT USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'attendance.read')
    );

-- Only users with devices.manage can modify PIN mappings
CREATE POLICY employee_pin_mappings_insert ON employee_pin_mappings
    FOR INSERT WITH CHECK (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'devices.manage')
    );

CREATE POLICY employee_pin_mappings_update ON employee_pin_mappings
    FOR UPDATE USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'devices.manage')
    );

CREATE POLICY employee_pin_mappings_delete ON employee_pin_mappings
    FOR DELETE USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'devices.manage')
    );

-- ============================================================================
-- Extend Attendance Records Table
-- ============================================================================

-- Add columns to track biometric device attendance
ALTER TABLE attendance_records
ADD COLUMN source TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN device_id UUID REFERENCES biometric_devices(id) ON DELETE SET NULL,
ADD COLUMN verify_mode INTEGER,
ADD COLUMN work_code TEXT,
ADD CONSTRAINT check_source CHECK (source IN ('manual', 'biometric'));

CREATE INDEX idx_attendance_records_source ON attendance_records(source);
CREATE INDEX idx_attendance_records_device ON attendance_records(device_id);

-- ============================================================================
-- New Permission: devices.manage
-- ============================================================================

INSERT INTO permissions (key, description) VALUES
    ('devices.manage', 'Manage biometric devices and employee PIN mappings');

-- Grant devices.manage to HospitalAdmin only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'HospitalAdmin' AND p.key = 'devices.manage';
