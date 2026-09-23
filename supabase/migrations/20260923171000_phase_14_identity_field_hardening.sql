create or replace function private.enforce_consultation_update_scope()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not (select private.is_admin()) and (
    old.requester_id is distinct from new.requester_id
    or old.consultant_id is distinct from new.consultant_id
    or old.vehicle_id is distinct from new.vehicle_id
    or old.service_type is distinct from new.service_type
    or old.subject is distinct from new.subject
    or old.details is distinct from new.details
  ) then
    raise exception 'consultation_identity_fields_immutable';
  end if;
  return new;
end;
$$;

revoke all on function private.enforce_consultation_update_scope() from public;

drop trigger if exists consultations_update_scope on public.consultations;
create trigger consultations_update_scope
before update on public.consultations
for each row execute function private.enforce_consultation_update_scope();

create or replace function private.enforce_conversation_creator()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.created_by is distinct from new.created_by then
    raise exception 'conversation_creator_immutable';
  end if;
  return new;
end;
$$;

revoke all on function private.enforce_conversation_creator() from public;

drop trigger if exists conversations_creator_immutable on public.conversations;
create trigger conversations_creator_immutable
before update on public.conversations
for each row execute function private.enforce_conversation_creator();