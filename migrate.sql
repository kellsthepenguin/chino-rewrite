create table users (
	id text not null,
	locale text not null default 'ko'
);

alter table users add money text not null default 0;
