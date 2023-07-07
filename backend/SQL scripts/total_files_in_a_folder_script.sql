select count(*) 
from  data.files 
WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP' 
AND directory REGEXP '^ticket_automation(/[^/]+)+$';

select filename,last_modified,hashvalue,hashed_filename
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

