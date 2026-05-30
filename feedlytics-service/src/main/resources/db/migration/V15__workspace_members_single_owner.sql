-- At most one OWNER membership row per workspace (application already enforces; DB backs it up).
CREATE UNIQUE INDEX uq_workspace_members_one_owner_per_workspace
    ON workspace_members (workspace_id)
    WHERE role = 'OWNER';
