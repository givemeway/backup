-- select DISTINCT directory from data.files WHERE directory REGEXP '^angular-src/new_project(/[^/]+)$';
select DISTINCT directory from data.files WHERE username = 'sandeep.kumar@idriveinc.com' AND device = 'DESKTOP' AND directory REGEXP '^\\.?ticket_automation/new code for ticket(/[^/]+)$' ORDER BY directory ASC;

