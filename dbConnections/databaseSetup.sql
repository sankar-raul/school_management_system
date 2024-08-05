create database school;
use school;
create table department (
	dept_id int primary key default 1,
    dept_name varchar(255) unique,
    duration int default 3,
    hod_id int,
    foreign key (hod_id) references faculties(f_id)
);
update facul set hod_id = 0 where hod_id <> 0;
SET SQL_SAFE_UPDATES = 1;
select * from faculties;
-- sql query to remove only those facultie3s who are not hod
-- delete from faculties where f_id not in (select hod_id from department where hod_id is not null);
delimiter //
create trigger before_insert_deparment
before insert on department
for each row
begin
	declare _dept_id int;
    set _dept_id = coalesce((select dept_id from department order by dept_id desc limit 1), 0) + 1;
    set new.dept_id = _dept_id;
end;
//
delimiter ;
 drop table faculties;
 drop table students;
 drop table department;
create table faculties (
	f_id int primary key default 1,
	f_name varchar(255) not null,
    u_id varchar(20) unique,
    age int,
    dob date not null,
    dept_name varchar(255) not null,
    email varchar(100) unique not null,
    password varchar(255) generated always as (dob) stored
);
drop trigger before_insert_faculties;
delimiter //
create trigger before_insert_faculties
before insert on faculties
for each row
begin
	declare _f_id int;
    declare _u_id varchar(20);
	set _f_id = coalesce((select f_id from faculties order by f_id desc limit 1), 0) + 1;
    set _u_id = coalesce(cast(right((select u_id from faculties where u_id like concat('F', new.dept_name, '%') order by u_id desc limit 1), 3) AS unsigned), 0) + 1;
	set new.f_id = _f_id;
    set new.u_id = concat('F', new.dept_name, lpad(_u_id, 3, 0));
    set new.age = timestampdiff(year, new.dob, curdate());
end;
// 
delimiter ;
select cast(right('bca0001', 4) AS unsigned);
insert into faculties (f_name, dob,dept_name, email) values ('Gangotri', '1989-02-12', 'BCA','gangotri@gmail.com');
insert into faculties (f_name, dob,dept_name, email) values ('Pallab Sen', '1980-05-15','BCA', 'pallabsen@gmail.com');
insert into faculties (f_name, dob, dept_name, email) values ('Anik Sir', '1974-01-21', 'BCA', 'aniksir@gmail.com');
insert into faculties (f_name, dob, dept_name, email) values ('Unknown Sir', '1978-01-21', 'BBA', 'unknown@gmail.com');
select * from faculties;
truncate table faculties;
drop table department;
 create table students (
    s_id int primary key default 1,
    s_name varchar(40) not null,
    reg_no varchar(30),
    roll_no char(15),
    reg_date date not null,
    dob date not null,
    email varchar(255) unique,
    phone char(14) unique not null,
    password varchar(255) generated always as (dob) stored,
    age int check (age > 5),
    dept_name varchar(255) not null,
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) on update cascade on delete cascade
);

delimiter //
create trigger before_insert_student
before insert on students
for each row
begin
	declare _s_id int;
	declare _dpt_id int;
    declare _unique int;
    set _s_id = coalesce((select s_id from students order by s_id desc limit 1), 0) + 1;
    select dept_id into _dpt_id from department where dept_name = new.dept_name;
    set _unique = coalesce(cast(right((select roll_no from students where roll_no like concat(new.dept_name, _dpt_id, '%') order by roll_no desc limit 1), 4) AS unsigned), 0) + 1;
    set new.s_id = _s_id;
    set new.roll_no = CONCAT(new.dept_name, _dpt_id, LPAD(_unique, 4, '0'));
	set new.reg_no = CONCAT(YEAR(new.reg_date), _dpt_id, LPAD(_unique, 4, '0'));
	set new.age = timestampdiff(year, new.dob, curdate());
END;
// 
delimiter ;
-- drop trigger  before_insert_student;
-- delimiter //
-- create procedure insert_student(
--     in p_s_name varchar(250),
--     in p_reg_date date,
--     in p_dob date,
--     in p_dept_name varchar(255)
-- )
-- begin
-- 	declare _s_id int;
-- 	declare _dpt_id int;
--     set _s_id = coalesce((select s_id from students order by s_id desc limit 1), 0) + 1;
--     insert into students (s_id, s_name, reg_date, dob, dept_name)
--     values (_s_id,p_s_name, p_reg_date, p_dob, p_dept_name);
--     -- fetch department id
--     select dept_id into _dpt_id from department where dept_name = p_dept_name;
--     update students
--     set
-- 		roll_no = CONCAT(p_dept_name, _dpt_id, LPAD(_s_id, 4, '0')),
--         reg_no = CONCAT(YEAR(p_reg_date), _dpt_id, LPAD(_s_id, 4, '0')),
--         age = timestampdiff(year, p_dob, curdate())
--     WHERE s_id = _s_id;
-- END; 
-- // 
-- delimiter ;
# drop procedure insert_student;

insert into department (dept_name, duration) values ("BCA",4), ("BBA",4);
-- call insert_student('Debanjan Bera', '2024-08-01', '2004-11-15', 'BCA');
-- call insert_student('Avi Raj', '2024-08-01', '2005-11-05', 'BBA');
-- call insert_student('Sankar Raul', '2024-08-01', '2005-11-15', 'BCA');
insert into students (s_name, reg_date, dob, phone, dept_name) values ('Sankar Raul', '2024-08-01', '2005-11-15', '9382613492', 'BCA'), ('Avi Raj', '2024-08-01', '2005-11-05', '9464895458', 'BBA'), ('Debanjan Bera', '2024-08-01', '2004-11-15', '8456958452', 'BCA');
select * from department order by dept_id;
select * from students;
select * from department;
select * from faculties;
update department set hod_id = 3 where dept_name = 'BCA';
update department set hod_id = 4 where dept_name = 'BBA';
truncate table students;
# describe students;
# SELECT COALESCE(3, 0) + 1 AS result;