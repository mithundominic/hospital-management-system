-- 0031_analytics_dashboard.sql
-- Advanced analytics dashboard functions and permissions for hospital administrators

-- Add analytics permissions
insert into permissions (key, description) values
    ('analytics.read', 'View analytics dashboard and reports'),
    ('analytics.export', 'Export analytics data to CSV/Excel')
on conflict (key) do nothing;

-- Grant to HospitalAdmin (both read and export)
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'HospitalAdmin' and p.key in ('analytics.read', 'analytics.export')
on conflict do nothing;

-- Grant read-only to SuperAdmin
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'SuperAdmin' and p.key = 'analytics.read'
on conflict do nothing;

-- Financial analytics function
create or replace function get_financial_analytics(
    p_hospital_id uuid,
    p_start_date date,
    p_end_date date
)
returns jsonb
language sql
security definer
stable
as $$
    with revenue_by_day as (
        select
            date(i.created_at) as date,
            sum(i.total_amount) as revenue,
            count(distinct i.id) as invoice_count
        from invoices i
        where i.hospital_id = p_hospital_id
            and date(i.created_at) between p_start_date and p_end_date
        group by date(i.created_at)
    ),
    payment_summary as (
        select
            sum(p.amount) as total_collected,
            count(p.id) as payment_count,
            p.payment_method,
            count(distinct p.invoice_id) as invoices_paid
        from payments p
        where p.hospital_id = p_hospital_id
            and date(p.paid_at) between p_start_date and p_end_date
        group by p.payment_method
    ),
    outstanding_summary as (
        select
            coalesce(sum(ib.balance_due), 0) as total_outstanding
        from invoice_balance ib
        where ib.hospital_id = p_hospital_id
    )
    select jsonb_build_object(
        'total_revenue', coalesce((select sum(total_amount) from invoices where hospital_id = p_hospital_id and date(created_at) between p_start_date and p_end_date), 0),
        'total_collected', coalesce((select sum(total_collected) from payment_summary), 0),
        'total_outstanding', coalesce((select total_outstanding from outstanding_summary), 0),
        'revenue_by_day', coalesce((select jsonb_agg(jsonb_build_object('date', date, 'revenue', revenue, 'invoice_count', invoice_count) order by date) from revenue_by_day), '[]'::jsonb),
        'payment_by_method', coalesce((select jsonb_agg(jsonb_build_object('method', payment_method, 'amount', total_collected, 'count', payment_count) order by total_collected desc) from payment_summary), '[]'::jsonb)
    );
$$;

-- Operational analytics function
create or replace function get_operational_analytics(
    p_hospital_id uuid,
    p_start_date date,
    p_end_date date
)
returns jsonb
language sql
security definer
stable
as $$
    with patient_flow as (
        select
            date(pr.registered_at) as date,
            count(distinct pr.patient_id) as new_patients
        from patient_registrations pr
        where pr.hospital_id = p_hospital_id
            and date(pr.registered_at) between p_start_date and p_end_date
        group by date(pr.registered_at)
    ),
    appointment_stats as (
        select
            a.status,
            count(a.id) as count
        from appointments a
        where a.hospital_id = p_hospital_id
            and date(a.scheduled_at) between p_start_date and p_end_date
        group by a.status
    ),
    bed_utilization as (
        select
            count(distinct b.id) as total_beds,
            count(distinct b.id) filter (where b.status = 'occupied') as occupied_beds,
            count(distinct b.id) filter (where b.status = 'available') as available_beds
        from beds b
        where b.hospital_id = p_hospital_id
    )
    select jsonb_build_object(
        'patient_flow', coalesce((select jsonb_agg(jsonb_build_object('date', date, 'new_patients', new_patients) order by date) from patient_flow), '[]'::jsonb),
        'appointments_by_status', coalesce((select jsonb_agg(jsonb_build_object('status', status, 'count', count)) from appointment_stats), '[]'::jsonb),
        'bed_utilization', (select jsonb_build_object('total_beds', total_beds, 'occupied_beds', occupied_beds, 'available_beds', available_beds, 'occupancy_rate', case when total_beds > 0 then round((occupied_beds::numeric / total_beds::numeric) * 100, 2) else 0 end) from bed_utilization)
    );
$$;

-- Clinical analytics function
create or replace function get_clinical_analytics(
    p_hospital_id uuid,
    p_start_date date,
    p_end_date date
)
returns jsonb
language sql
security definer
stable
as $$
    with doc_encounters as (
        select
            e.doctor_membership_id,
            count(distinct e.id) as encounter_count,
            count(distinct e.patient_id) as encounter_patient_count,
            coalesce(sum(i.total_amount), 0) as encounter_revenue
        from encounters e
        left join invoices i on i.encounter_id = e.id and i.hospital_id = p_hospital_id
        where e.hospital_id = p_hospital_id
            and date(e.created_at) between p_start_date and p_end_date
        group by e.doctor_membership_id
    ),
    doc_appointments as (
        select
            a.doctor_membership_id,
            count(distinct a.patient_id) as appointment_patient_count
        from appointments a
        where a.hospital_id = p_hospital_id
            and date(a.scheduled_at) between p_start_date and p_end_date
        group by a.doctor_membership_id
    ),
    doctor_performance as (
        select
            dp.id as doctor_id,
            coalesce(u.raw_user_meta_data->>'full_name', u.email, 'Doctor') as doctor_name,
            d.name as department_name,
            coalesce(da.appointment_patient_count, de.encounter_patient_count, 0) as patient_count,
            coalesce(de.encounter_count, 0) as encounter_count,
            coalesce(de.encounter_revenue, 0) as revenue_generated
        from doctor_profiles dp
        join memberships m on m.id = dp.membership_id
        left join auth.users u on u.id = m.user_id
        left join departments d on d.id = dp.department_id
        left join doc_encounters de on de.doctor_membership_id = dp.membership_id
        left join doc_appointments da on da.doctor_membership_id = dp.membership_id
        where m.hospital_id = p_hospital_id
    ),
    encounter_types as (
        select
            e.encounter_type,
            count(e.id) as count
        from encounters e
        where e.hospital_id = p_hospital_id
            and date(e.created_at) between p_start_date and p_end_date
        group by e.encounter_type
    )
    select jsonb_build_object(
        'doctor_performance', coalesce((select jsonb_agg(jsonb_build_object('doctor_id', doctor_id, 'doctor_name', doctor_name, 'department', department_name, 'patient_count', patient_count, 'encounter_count', encounter_count, 'revenue', revenue_generated) order by patient_count desc) from doctor_performance), '[]'::jsonb),
        'encounter_types', coalesce((select jsonb_agg(jsonb_build_object('type', encounter_type, 'count', count)) from encounter_types), '[]'::jsonb)
    );
$$;

-- Inventory analytics function
create or replace function get_inventory_analytics(
    p_hospital_id uuid,
    p_start_date date,
    p_end_date date
)
returns jsonb
language sql
security definer
stable
as $$
    with fast_moving as (
        select
            ii.name,
            count(st.id) as transaction_count,
            sum(abs(st.quantity)) filter (where st.transaction_type = 'out') as quantity_dispensed
        from inventory_items ii
        left join stock_transactions st on st.inventory_item_id = ii.id
            and date(st.transaction_at) between p_start_date and p_end_date
        where ii.hospital_id = p_hospital_id
        group by ii.id, ii.name
        having sum(abs(st.quantity)) filter (where st.transaction_type = 'out') > 0
        order by quantity_dispensed desc
        limit 10
    ),
    slow_moving as (
        select
            ii.name,
            coalesce(sum(abs(st.quantity)) filter (where st.transaction_type = 'out'), 0) as quantity_dispensed
        from inventory_items ii
        left join stock_transactions st on st.inventory_item_id = ii.id
            and date(st.transaction_at) between p_start_date and p_end_date
        where ii.hospital_id = p_hospital_id
        group by ii.id, ii.name
        order by quantity_dispensed asc
        limit 10
    ),
    low_stock as (
        select
            name,
            current_stock,
            reorder_level
        from low_stock_alert
        where hospital_id = p_hospital_id
    ),
    stock_count as (
        select
            coalesce(sum(current_stock), 0) as total_units
        from inventory_current_stock
        where hospital_id = p_hospital_id
    )
    select jsonb_build_object(
        'fast_moving_items', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'quantity_dispensed', quantity_dispensed, 'transaction_count', transaction_count)) from fast_moving), '[]'::jsonb),
        'slow_moving_items', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'quantity_dispensed', quantity_dispensed)) from slow_moving), '[]'::jsonb),
        'low_stock_alerts', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'current_quantity', current_stock, 'reorder_level', reorder_level)) from low_stock), '[]'::jsonb),
        'total_stock_units', coalesce((select total_units from stock_count), 0)
    );
$$;

-- Overview analytics function (aggregates KPIs from all domains)
create or replace function get_analytics_overview(
    p_hospital_id uuid,
    p_start_date date,
    p_end_date date
)
returns jsonb
language sql
security definer
stable
as $$
    with kpis as (
        select
            coalesce((select sum(total_amount) from invoices where hospital_id = p_hospital_id and date(created_at) between p_start_date and p_end_date), 0) as total_revenue,
            coalesce((select count(distinct patient_id) from patient_registrations where hospital_id = p_hospital_id and date(registered_at) between p_start_date and p_end_date), 0) as total_patients,
            coalesce((select count(id) from appointments where hospital_id = p_hospital_id and date(scheduled_at) between p_start_date and p_end_date), 0) as total_appointments,
            coalesce((select count(p.id) from prescriptions p where p.hospital_id = p_hospital_id and date(p.created_at) between p_start_date and p_end_date), 0) as active_prescriptions,
            coalesce((select sum(ib.balance_due) from invoice_balance ib where ib.hospital_id = p_hospital_id), 0) as pending_payments
    ),
    bed_stats as (
        select
            count(id) as total_beds,
            count(id) filter (where status = 'occupied') as occupied_beds
        from beds
        where hospital_id = p_hospital_id
    )
    select jsonb_build_object(
        'total_revenue', (select total_revenue from kpis),
        'total_patients', (select total_patients from kpis),
        'total_appointments', (select total_appointments from kpis),
        'active_prescriptions', (select active_prescriptions from kpis),
        'pending_payments', (select pending_payments from kpis),
        'bed_occupancy_rate', (select case when total_beds > 0 then round((occupied_beds::numeric / total_beds::numeric) * 100, 2) else 0 end from bed_stats)
    );
$$;

-- Grant execution to authenticated users
grant execute on function get_financial_analytics(uuid, date, date) to authenticated;
grant execute on function get_operational_analytics(uuid, date, date) to authenticated;
grant execute on function get_clinical_analytics(uuid, date, date) to authenticated;
grant execute on function get_inventory_analytics(uuid, date, date) to authenticated;
grant execute on function get_analytics_overview(uuid, date, date) to authenticated;
