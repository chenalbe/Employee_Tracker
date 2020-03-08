CREATE DATABASE employee_db;
USE employee_db;
CREATE TABLE employee (
	id int not null auto_increment,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	role_id int not null,
	manger_id int,
    Primary key (id)
); 

CREATE Table role (
	id int not null auto_increment,
    title varchar(30) not null,
    salary decimal (15, 2),
    department_id int not null,
    primary key (id)
);

CREATE Table department (
	id int not null auto_increment,
    name varchar(30) not null,
    primary key (id)
);