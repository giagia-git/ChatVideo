
CREATE TABLE IF NOT EXISTS `User` (
    U_id BigInt NOT NULL AUTO_INCREMENT,
    U_email varchar(50),
    U_fullname varchar(50),
    U_password varchar(50),
    U_sodienthoai varchar(50),
    U_diachi varchar(50),
    U_thoigiantao date,
    trangthai varchar(30),
    PRIMARY KEY(U_id)
);

use myDatabase;

INSERT INTO User(U_email,U_password,U_thoigiantao,trangthai) VALUES('giap92446@gmail.com','123456','2019-12-31','Hoat dong');
INSERT INTO User(U_email,U_password,U_thoigiantao,trangthai) VALUES('nguyenvana@gmail.com','123456','2019-12-31','Hoat dong');