DO
$$
BEGIN
   IF NOT EXISTS (
       SELECT FROM pg_catalog.pg_roles WHERE rolname = 'grafanareader'
   ) THEN
      CREATE USER grafanareader WITH PASSWORD 'grafanapass';
END IF;
END
$$;

GRANT SELECT ON tokens TO grafanareader;