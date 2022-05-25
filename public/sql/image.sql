use `myDatabase`;

CREATE TABLE IF NOT EXISTS `Image` (
    I_id BigInt NOT NULL AUTO_INCREMENT,
    I_name varchar(255) NOT NULL,
    I_path varchar(255) NOT NULL,
    I_mimetype varchar(50) NOT NULL,
    PRIMARY KEY(I_id)
);

