SELECT balance.ba_id, balance.cs_id, balance.stale - COALESCE(revenue.payout, 0) AS total
FROM balance
LEFT JOIN revenue ON balance.cs_id = revenue.cs_id



SELECT balance.cs_id, balance.date_time, revenue.date_time, balance.stale,revenue.payout,aggregate.total
FROM balance
INNER JOIN revenue ON balance.cs_id = revenue.cs_id
INNER JOIN aggregate ON balance.cs_id = aggregate.cs_id;



SELECT 
    COALESCE(balance.cs_id, revenue.cs_id, aggregate.cs_id) AS cs_id,
    COALESCE(balance.date_time, revenue.date_time) AS date_time,
    COALESCE(balance.stale, 0) AS stale,
    COALESCE(revenue.payout, 0) AS payout,
    COALESCE(aggregate.total, 0) AS total
FROM balance
LEFT JOIN revenue ON balance.cs_id = revenue.cs_id
LEFT JOIN aggregate ON balance.cs_id = aggregate.cs_id

UNION

SELECT 
    COALESCE(balance.cs_id, revenue.cs_id, aggregate.cs_id) AS cs_id,
    COALESCE(balance.date_time, revenue.date_time) AS date_time,
    COALESCE(balance.stale, 0) AS stale,
    COALESCE(revenue.payout, 0) AS payout,
    COALESCE(aggregate.total, 0) AS total
FROM revenue
LEFT JOIN balance ON balance.cs_id = revenue.cs_id
LEFT JOIN aggregate ON revenue.cs_id = aggregate.cs_id

UNION

SELECT 
    COALESCE(balance.cs_id, revenue.cs_id, aggregate.cs_id) AS cs_id,
    COALESCE(balance.date_time, revenue.date_time) AS date_time,
    COALESCE(balance.stale, 0) AS stale,
    COALESCE(revenue.payout, 0) AS payout,
    COALESCE(aggregate.total, 0) AS total
FROM aggregate
LEFT JOIN balance ON balance.cs_id = aggregate.cs_id
LEFT JOIN revenue ON aggregate.cs_id = revenue.cs_id;

-- แยกแถวจากตาราง balance
SELECT cs_id, date_time,stale, 0 AS payout, 0 AS total
FROM balance

UNION ALL

-- แยกแถวจากตาราง revenue
SELECT cs_id , date_time, 0 AS stale, payout, 0 AS total
FROM revenue

UNION ALL

-- แยกแถวจากตาราง aggregate
SELECT  a.cs_id, b.date_time, 0 AS stale, 0 AS payout, total
FROM aggregate a
JOIN balance b ON a.cs_id = b.cs_id;


-- ใช้กับ databalance
SELECT cs_id, date_time,stale, 0 AS payout, 0 AS total
FROM balance

UNION ALL
SELECT r.cs_id, r.date_time, 0 AS stale, r.payout, a.total
FROM revenue r
JOIN (
    SELECT cs_id, total
    FROM aggregate
) a ON r.cs_id = a.cs_id;