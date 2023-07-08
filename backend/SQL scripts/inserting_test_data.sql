insert into data.files(`username`,`device`,`directory`,`filename`,`hashed_filename`,`last_modified`,`hashvalue`,`versions`,`size`,`snapshot`)
values
('sandeep.kumar@idriveinc.com','DESKTOP','DIR','FILENAME','HASH','lastmodified','hash2',2,34343,'sandeep');

INSERT ignore into data.directories (`device`,`username`,`folder`,`parent_id`,`path`)
values 
('DESKTOP','root',NULL,'/'),
('DESKTOP','C',1,'C'),
('DESKTOP','users',2,'C/users'),
('DESKTOP','sandk',3,'C/users/sandk'),
('DESKTOP','documents',4,'C/users/sandk'),
('DESKTOP','support',3,'C/users/support'),
('DESKTOP','desktop',4,'C/users/sandk/desktop'),
('DESKTOP','desktop',6,'C/users/support/desktop'),
('DESKTOP','mysql',2,'C/mysql'),
('DESKTOP','files',2,'C/files'),
('DESKTOP','D',1,'D'),
('DESKTOP','NodeJs',11,'D/NodeJs'),
('DESKTOP','sand.kumar.gr@gmail.com',12,'D/NodeJs/sand.kumar.gr@gmail.com'),
('DESKTOP','desktop',NULL,'D/NodeJs/sand.kumar.gr@gmail.com/desktop');

