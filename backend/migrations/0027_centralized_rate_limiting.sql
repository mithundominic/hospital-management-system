-- 0027_centralized_rate_limiting.sql
-- Responsibility: Centralized, distributed rate limiting storage and atomic increment RPC

create table if not exists rate_limit_buckets (
    key text primary key,
    count integer not null default 1,
    reset_at timestamptz not null
);

create index if not exists idx_rate_limit_buckets_reset_at 
on rate_limit_buckets(reset_at);

-- Atomic increment and window enforcement function
create or replace function check_rate_limit(
    p_key text,
    p_window_seconds integer,
    p_max_requests integer
) returns jsonb
language plpgsql
security definer
as $$
declare
    v_now timestamptz := clock_timestamp();
    v_reset_at timestamptz;
    v_count integer;
    v_allowed boolean;
begin
    insert into rate_limit_buckets (key, count, reset_at)
    values (p_key, 1, v_now + (p_window_seconds || ' seconds')::interval)
    on conflict (key) do update
    set 
        count = case 
            when rate_limit_buckets.reset_at <= v_now then 1
            else rate_limit_buckets.count + 1
        end,
        reset_at = case 
            when rate_limit_buckets.reset_at <= v_now then v_now + (p_window_seconds || ' seconds')::interval
            else rate_limit_buckets.reset_at
        end
    returning count, reset_at into v_count, v_reset_at;

    v_allowed := (v_count <= p_max_requests);

    return jsonb_build_object(
        'allowed', v_allowed,
        'limit', p_max_requests,
        'remaining', greatest(0, p_max_requests - v_count),
        'reset_seconds', greatest(0, ceil(extract(epoch from (v_reset_at - v_now))))
    );
end;
$$;

-- Periodic cleanup function to remove stale buckets
create or replace function cleanup_expired_rate_limits()
returns integer
language plpgsql
security definer
as $$
declare
    v_deleted integer;
begin
    delete from rate_limit_buckets
    where reset_at < clock_timestamp() - interval '1 hour';
    get diagnostics v_deleted = row_count;
    return v_deleted;
end;
$$;

-- Grant execution to all roles
grant execute on function check_rate_limit(text, integer, integer) to anon, authenticated, service_role;
grant execute on function cleanup_expired_rate_limits() to authenticated, service_role;
