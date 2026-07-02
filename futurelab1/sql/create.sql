create table usuario (
    id int primary key,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    idade int
    tipo_usuario varchar(50) not null
);

create table pergunta (
    id int primary key,
    perguntas varchar(255) not null
);