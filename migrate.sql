create table users (
	id text not null,
	locale text not null default 'ko'
);

alter table users add money int not null default 0;

alter table users add cooldowns text not null default '{}';

create table guilds (
    id text not null,
    locale text not null default 'ko'
)
