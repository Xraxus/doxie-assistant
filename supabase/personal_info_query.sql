-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
create table personal_info (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function match_personal_info (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (personal_info.embedding <=> query_embedding) as similarity
  from personal_info
  where metadata @> filter
  order by personal_info.embedding <=> query_embedding
  limit match_count;
end;
$$;