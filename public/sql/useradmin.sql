use `myDatabase`;

CREATE TABLE IF NOT EXISTS `UserAdmin` (
    UA_id BigInt NOT NULL AUTO_INCREMENT,
    UA_account varchar(50),
    UA_email varchar(50),
    UA_fullname varchar(50),
    UA_password varchar(50),
    UA_sodienthoai varchar(50),
    UA_diachi varchar(50),
    PRIMARY KEY(UA_id)
);

INSERT INTO `UserAdmin`(`UA_account`,`UA_password`) VALUES('giap92446','123456');
INSERT INTO `UserAdmin`(`UA_account`,`UA_password`) VALUES('giaB1910214','123456');
INSERT INTO `UserAdmin`(`UA_account`,`UA_password`) VALUES('lythuaan0327','123456');