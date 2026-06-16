-- 1. Add the Master User (Admin)
INSERT INTO users (uid, email, full_name, faculty, role, created_at)
VALUES ('admin-uid-master', 'admin25@uce.edu.ec', 'Administrator UCE', 'Engineering', 'UCE_ADMIN', NOW())
ON CONFLICT (uid) DO NOTHING;

-- 2. Generate 100 seed users (students) using a native Postgres loop
INSERT INTO users (uid, email, full_name, faculty, role, created_at)
SELECT 
    'user-uid-seed-' || i,
    'user' || i || CASE WHEN i % 5 = 0 THEN '@gmail.com' ELSE '@uce.edu.ec' END,
    'Seed User ' || i,
    CASE 
        WHEN i % 5 = 0 THEN 'External Client'
        WHEN i % 4 = 0 THEN 'Engineering and Applied Sciences'
        WHEN i % 4 = 1 THEN 'Arts'
        WHEN i % 4 = 2 THEN 'Medical Sciences'
        ELSE 'Economic Sciences'
    END,
    CASE WHEN i % 5 = 0 THEN 'UCE_CLIENT' ELSE 'UCE_STUDENT' END,
    NOW()
FROM generate_series(1, 100) AS s(i)
ON CONFLICT (uid) DO NOTHING;