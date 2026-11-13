# Architecture rules

- Public form submissions are validated in a shared server function, screened with a honeypot, and saved through least-privileged database access under RLS; owner email notifications use the managed app-email templates once a sender domain is configured.