create table if not exists public.project_requests (
    id uuid primary key default gen_random_uuid(),

    name varchar(100) not null,

    email varchar(150) not null,

    service varchar(100) not null,

    budget varchar(100),

    message text not null,

    source varchar(100) default 'nexora-website',

    status varchar(30) default 'new',

    created_at timestamptz
        default now()
);