-- select * from data.directories where path REGEXP '^\\.?(/[^/]+)$';
-- listing the machines
select folder from data.directories where username = 'givemeway' AND path REGEXP '^\\.?(/[^/]+)$';
-- listing the folders in device
-- select folder,path from data.directories where username = 'sandeep.kumar@idriveinc.com' AND path REGEXP '^\\.?/DESKTOP-10RSGE8/canned(/[^/]+)$';