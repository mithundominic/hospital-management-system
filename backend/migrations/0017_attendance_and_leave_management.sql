-- 0017_attendance_and_leave_management.sql
-- Staff attendance tracking and leave management system.
--
-- Deliberate calls:
--  - attendance_records.check_out_time is nullable — a null value means the staff
--    member is currently checked in. Check-out updates the existing row rather
--    than creating a new one.
--  - leave_balances has a UNIQUE constraint on (hospital_id, user_id, year) to
--    prevent duplicate balance records for the same user/hospital/year combination.
--  - Leave days_count is stored as NUMERIC to support half-day leaves if needed
--    in the future (e.g., 0.5 days).
--  - RLS policies use rbac_effective_hospital_permission() for proper authorization.
--    'attendance.write' allows users to manage their own records, while
--    'attendance.read' grants access to view all hospital attendance records.

-- Attendance tracking table
create table attendance_records (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    check_in_time timestamptz not null,
    check_out_time timestamptz,
    status text not null default 'checked_in',  -- 'checked_in' | 'checked_out' | 'absent'
    notes text,
    created_at timestamptz not null default now()
);

create index idx_attendance_records_hospital on attendance_records(hospital_id);
create index idx_attendance_records_user on attendance_records(user_id);
create index idx_attendance_records_date on attendance_records(date(check_in_time));

alter table attendance_records enable row level security;

-- Users can view their own records or if they have attendance.read permission
create policy attendance_records_select on attendance_records
    for select using (
        auth.uid() = user_id
        or rbac_effective_hospital_permission(auth.uid(), hospital_id, 'attendance.read')
    );

-- Users can insert their own attendance records if they have attendance.write
create policy attendance_records_insert on attendance_records
    for insert with check (
        auth.uid() = user_id
        and rbac_effective_hospital_permission(auth.uid(), hospital_id, 'attendance.write')
    );

-- Users can update their own records (for check-out) or admins can update any
create policy attendance_records_update on attendance_records
    for update using (
        auth.uid() = user_id
        or rbac_effective_hospital_permission(auth.uid(), hospital_id, 'attendance.read')
    );

-- Leave applications table
create table leave_applications (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    leave_type text not null,  -- 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity'
    start_date date not null,
    end_date date not null,
    days_count numeric not null,
    reason text,
    status text not null default 'pending',  -- 'pending' | 'approved' | 'rejected' | 'cancelled'
    approved_by uuid references auth.users(id),
    approved_at timestamptz,
    rejection_reason text,
    created_at timestamptz not null default now(),
    check (start_date <= end_date),
    check (days_count > 0)
);

create index idx_leave_applications_hospital on leave_applications(hospital_id);
create index idx_leave_applications_user on leave_applications(user_id);
create index idx_leave_applications_status on leave_applications(status);
create index idx_leave_applications_dates on leave_applications(start_date, end_date);

alter table leave_applications enable row level security;

-- Users can view their own applications or if they have leave.read permission
create policy leave_applications_select on leave_applications
    for select using (
        auth.uid() = user_id
        or rbac_effective_hospital_permission(auth.uid(), hospital_id, 'leave.read')
    );

-- Users can create their own leave applications if they have leave.write
create policy leave_applications_insert on leave_applications
    for insert with check (
        auth.uid() = user_id
        and rbac_effective_hospital_permission(auth.uid(), hospital_id, 'leave.write')
    );

-- Users can update their own pending applications or admins can update any
create policy leave_applications_update on leave_applications
    for update using (
        (auth.uid() = user_id and status = 'pending')
        or rbac_effective_hospital_permission(auth.uid(), hospital_id, 'leave.read')
    );

-- Leave balance tracking table
create table leave_balances (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    year integer not null,
    casual_leave numeric not null default 12,
    sick_leave numeric not null default 12,
    earned_leave numeric not null default 15,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (hospital_id, user_id, year)
);

create index idx_leave_balances_hospital on leave_balances(hospital_id);
create index idx_leave_balances_user on leave_balances(user_id);
create index idx_leave_balances_year on leave_balances(year);

alter table leave_balances enable row level security;

-- Users can view their own balance or if they have leave.read permission
create policy leave_balances_select on leave_balances
    for select using (
        auth.uid() = user_id
        or rbac_effective_hospital_permission(auth.uid(), hospital_id, 'leave.read')
    );

-- Only users with leave.read permission can insert/update balances (admins only)
create policy leave_balances_insert on leave_balances
    for insert with check (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'leave.read')
    );

create policy leave_balances_update on leave_balances
    for update using (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'leave.read')
    );
