create database if not exists school;
use school;
-- drop database school;
-- drop table results;

-- drop trigger before_insert_results;
-- truncate table results;

-- select * from results;

-- update facul set hod_id = 0 where hod_id <> 0;
-- SET SQL_SAFE_UPDATES = 1;
-- select * from faculties;
-- sql query to remove only those facultie3s who are not hod
-- delete from faculties where f_id not in (select hod_id from department where hod_id is not null);

--  drop table students;
--  drop table department;
create table if not exists faculties (
	f_id int primary key default 1,
	f_name varchar(255) not null,
    u_id varchar(20) unique,
    age int,
    dob date not null,
    dept_id int not null,
    email varchar(100) unique not null,
    password varchar(255) generated always as (dob) stored
);
-- drop trigger before_insert_faculties;
delimiter //
create trigger before_insert_faculties
before insert on faculties
for each row
begin
	declare _f_id int;
    declare _u_id varchar(20);
    declare _dpt_name varchar(255);
    select dept_name into _dpt_name from department where id = new.dept_id;
	set _f_id = coalesce((select f_id from faculties order by f_id desc limit 1), 0) + 1;
    set _u_id = coalesce(cast(right((select u_id from faculties where u_id like concat('F', _dpt_name, '%') order by u_id desc limit 1), 3) AS unsigned), 0) + 1;
	set new.f_id = _f_id;
    set new.u_id = concat('F', _dpt_name, lpad(_u_id, 3, 0));
    set new.age = timestampdiff(year, new.dob, curdate());
end;
// 
delimiter ;
create table if not exists department (
	id int primary key default 1,
    dept_name varchar(255) unique,
    duration int default 3,
    start_month tinyint default 8, -- August
    hod_id int,
    foreign key (hod_id) references faculties(f_id)
);
delimiter //
create trigger before_insert_deparment
before insert on department
for each row
begin
	declare _dept_id int;
    set _dept_id = coalesce((select id from department order by id desc limit 1), 0) + 1;
    set new.id = _dept_id;
end;
//
delimiter ;

select * from faculties;
-- truncate table faculties;
-- drop table department;
 create table if not exists students (
    s_id int primary key default 1,
    s_name varchar(40) not null,
    _from date not null,
	dept_id int not null,
    reg_no varchar(30),
    roll_no char(15),
    reg_date date not null,
    dob date not null,
    email varchar(255) unique not null,
    phone char(14) unique not null,
    password varchar(255) not null,
    FOREIGN KEY (dept_id) REFERENCES department(id) on update cascade on delete cascade
);
-- alter table students modify column _from date not null;
select * from students;
-- alter table students add column _from int not null;
-- alter table students add column _to int;
-- alter table students add column semesters int;

-- create a view students department merge table
create view students_dept_view as
select *,
timestampdiff(year, dob, curdate()) as age,
date_add(students._from, interval department.duration year) as _to
from students left join department on students.dept_id = department.id;

-- drop view students_dept_view;
select * from students_dept_view;
select * from students;
-- drop trigger before_insert_student;
delimiter //
create trigger before_insert_student
before insert on students
for each row
begin
	declare _s_id int;
	declare _dpt_name varchar(255);
    declare _unique int;
    set _s_id = coalesce((select s_id from students order by s_id desc limit 1), 0) + 1;
    select dept_name into _dpt_name from department where id = new.dept_id;
    set _unique = coalesce(cast(right((select roll_no from students where roll_no like concat(_dpt_name ,new.dept_id, '%') order by roll_no desc limit 1), 4) AS unsigned), 0) + 1;
    set new.s_id = _s_id;
    set new.roll_no = CONCAT(_dpt_name, new.dept_id, LPAD(_unique, 4, '0'));
--  set new.roll_no = coalesce(cast(right((select roll_no from students where roll_no like concat(new.dept_id, _dpt_name, '%') order by roll_no desc limit 1), 4) AS unsigned), 0) + 1;
	set new.reg_no = CONCAT(YEAR(new.reg_date), new.dept_id, LPAD(_unique, 4, '0'));
END;
// 
delimiter ;
select * from students;
create index idx_reg_no on students (reg_no);
create table if not exists results (
	id int auto_increment primary key,
	reg_no varchar(30) not null,
    marks json not null, -- {"english": 87, "math": 89, "geography": 78},
    pass_grade int default 35,
    total int not null,
	dept_id int not null,
    full_marks int not null,
    grade char(3) not null,
    percentage float4 generated always as ((total / full_marks)*100) stored,
    semester int not null,
    batch date not null,
    foreign key (reg_no) references students(reg_no)
);
-- drop table results;
insert into department (dept_name, duration) values ('BCA',4), ('BBA',4);
-- select cast(right('bca0001', 4) AS unsigned);
select * from department;
insert into faculties (f_name, dob,dept_id, email) values ('Gangotri', '1989-02-12', 1,'gangotri@gmail.com');
insert into faculties (f_name, dob,dept_id, email) values ('Pallab Sen', '1980-05-15', 1, 'pallabsen@gmail.com');
insert into faculties (f_name, dob, dept_id, email) values ('Anik Sir', '1974-01-21', 1, 'aniksir@gmail.com');
insert into faculties (f_name, dob, dept_id, email) values ('Unknown Sir', '1978-01-21', 2, 'unknown@gmail.com');
select * from faculties;
select * from students;
-- delete from students where s_id in (1,2,3);
insert into students (s_name, _from, reg_date, dob, email, phone, dept_id, password) values ('Sankar Raul', '2023-08-01',  '2024-08-01', '2005-11-15', 'raulsankar99@gmail.com', '9382613492', 1, 'sankar'), ('Avi Raj', '2023-08-01','2024-08-01', '2005-11-05', 'aviraj@gmail.com', '9464895458', 2, 'sankar'), ('Debanjan Bera', '2023-08-01', '2024-08-01', '2004-11-15', 'debanjan@gmail.com', '8456958452', 1, 'sankar');
select * from department order by id;
select * from students;
select * from department;
select * from faculties;
select * from results;
-- update department set hod_id = 3 where dept_name = 'BCA';
-- update department set hod_id = 4 where dept_name = 'BBA';
-- truncate table students;
# describe students;
# SELECT COALESCE(3, 0) + 1 AS result;

-- admin
create table if not exists admin (
	email varchar(30) primary key,
    password varchar(255) not null
);
insert into admin (email, password) values ('sankar@sankar.tech', 'admin'), ('sankar@sankarraul.me', 'admin');
select * from admin;

-- session cookie management
create table if not exists sessions (
	u_id varchar(255) not null,
    valid_till int not null,
    security_key varchar(255) not null,
    u_type varchar(30) not null,
    expiry datetime,
    primary key (u_id, security_key)
);
-- drop trigger before_insert_sessions;
select * from sessions;
delimiter //
create trigger before_insert_sessions
before insert on sessions
for each row
begin
	set new.expiry = date_add(Now(), interval new.valid_till minute);
end;
//
delimiter ;
-- delete expired sessions cookie
create event if not exists delete_expired_session_cookie
	on schedule every 3 minute
    do
		delete from sessions where expiry < Now();
-- drop event if exists  delete_expired_session_cookie;
-- drop table sessions;
-- truncate table sessions;
-- insert into sessions (u_id, security_key, u_type, valid_till) values ('9382613492','qwertyuiop', 'student',1);
select expiry, Now() from sessions;
-- select Now() as Now, date_add(Now(), interval 2 minute);

-- forget password
create table otp (
	u_id varchar(50) primary key,
    code char(7) not null,
    expiry datetime
);
select * from otp;
truncate table otp;
-- insert into otp (u_id, code) values ('sankar@sankarraul.me', '232421');
delimiter //
create trigger before_insert_otp
before insert on otp
for each row
begin
	set new.expiry = date_add(Now(), interval 10 minute);
end;
//
delimiter ;
select * from otp;
create event delete_expired_otp
on schedule every 1 minute
do
	delete from otp where expiry < Now();
select * from sessions;
select * from students;
select * from faculties;
select * from department;
select * from results;
select * from admin;