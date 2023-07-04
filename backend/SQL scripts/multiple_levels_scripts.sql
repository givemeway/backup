-- select DISTINCT directory from data.files WHERE directory REGEXP '^angular-src/new_project(/[^/]+)+$';
-- select DISTINCT directory from data.files WHERE directory REGEXP '^angular-src/new_project(/[^/]+){2}$';
-- select DISTINCT directory from data.files WHERE directory REGEXP '^\.angular(/[^/]+){3}$';
select DISTINCT directory from data.files WHERE directory REGEXP '^\\.?new_project/triox/node_modules(/[^/]+)$'


