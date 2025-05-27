-- Função para criar políticas de armazenamento
create or replace function create_storage_policy(
  bucket_name text,
  policy_name text,
  policy_definition jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  -- Criar a política
  insert into storage.policies (name, definition, bucket_id)
  select
    policy_name,
    policy_definition,
    id
  from storage.buckets
  where name = bucket_name;
exception
  when unique_violation then
    -- Se a política já existe, atualiza
    update storage.policies
    set definition = policy_definition
    where name = policy_name
    and bucket_id = (select id from storage.buckets where name = bucket_name);
end;
$$; 