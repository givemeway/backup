select count(*) 
from  data.files 
WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP' 
AND directory REGEXP '^ticket_automation(/[^/]+)+$';

select count(*)
from data.files 
WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP' 
AND directory = 'ticket_automation' ORDER BY filename ASC;

-- SET SESSION group_concat_max_len = 10000000;

-- SELECT distinct directory, CONCAT('[', GROUP_CONCAT(CONCAT('[', '"', filename, '", "', hashvalue, '", "', last_modified, '"]')), ']') as file_details
-- from  data.files 
-- WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP-10RSGE8' AND directory REGEXP '^C(/[^/]+)+$'
-- group by directory;

-- SELECT distinct directory, CONCAT('[', GROUP_CONCAT(CONCAT('[', '"', filename, '", "', hashvalue, '", "', last_modified, '"]')), ']') as file_details
-- from data.files 
-- WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP-10RSGE8' AND directory = 'C' 
-- group by directory;

--  select * from  data.files  WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP' AND hashed_filename REGEXP '\\${3}[0-9a-zA-Z]{64}\\${3}NA'
-- ^supervisorq\.txt(\\${3}[0-9a-fA-F]{64}\\${3}NA)?$