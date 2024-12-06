String sql = 
    "SELECT " +
        "n.state, " +
        "t.createtime, " +
        "t.createman, " +
        "t.truckcompany, " +
        "t.cargoname, " +
        "t.type, " +
        "(SELECT s.code " +
            "FROM pub_stackforls s " +
            "WHERE s.stackname = '" + oldstackname + "') AS oldstackcode, " +
        "(SELECT LISTAGG((SELECT r.id " +
                            "FROM pub_warehousedoor r " +
                            "WHERE r.wdname = s.wdname), ',') " +
                "WITHIN GROUP (ORDER BY lvl) AS warehouse_codes " +
            "FROM (SELECT TRIM(REGEXP_SUBSTR('" + oldwdname + "', '[^,]+', 1, LEVEL)) AS wdname, " +
                         "LEVEL AS lvl " +
                  "FROM DUAL " +
                  "CONNECT BY LEVEL <= LENGTH('" + oldwdname + "') - LENGTH(REPLACE('" + oldwdname + "', ',', '')) + 1) s) AS oldwdcodes, " +
        "(SELECT s.type " +
            "FROM pub_stackforls s " +
            "WHERE s.stackname = '" + oldstackname + "') AS oldstacktype, " +
        "t.orderno, " +
        "t.outformno, " +
        "t.blno, " +
        "t.informno, " +
        "t.remark, " +
        "n.planno, " +
        "t.shipname, " +
        "t.planweight, " +
        "(SELECT LISTAGG((SELECT r.id " +
                            "FROM pub_warehousedoor r " +
                            "WHERE r.wdname = s.wdname), ',') " +
                "WITHIN GROUP (ORDER BY lvl) AS warehouse_codes " +
            "FROM (SELECT TRIM(REGEXP_SUBSTR('" + newwdname + "', '[^,]+', 1, LEVEL)) AS wdname, " +
                         "LEVEL AS lvl " +
                  "FROM DUAL " +
                  "CONNECT BY LEVEL <= LENGTH('" + newwdname + "') - LENGTH(REPLACE('" + newwdname + "', ',', '')) + 1) s) AS newwdcodes, " +
        "(SELECT s.code " +
            "FROM pub_stackforls s " +
            "WHERE s.stackname = '" + nowstackname + "') AS newstackcode, " +
        "(SELECT s.type " +
            "FROM pub_stackforls s " +
            "WHERE s.stackname = '" + nowstackname + "') AS newstacktype, " +
        "n.truckno, " +
        "t.regidno, " +
        "t.dibangnumber, " +
        "t.loadometerno, " +
        "e.classes, " +
        "(SELECT CASE " +
            "WHEN t.loudounumber IS NULL THEN NULL " +
            "ELSE (SELECT LISTAGG(TRIM(REGEXP_SUBSTR(t.loudounumber, '[^,]+', 1, LEVEL)), ',') " +
                     "WITHIN GROUP (ORDER BY LEVEL) " +
                  "FROM DUAL " +
                  "CONNECT BY LEVEL <= LENGTH(t.loudounumber) - LENGTH(REPLACE(t.loudounumber, ',', '')) + 1) " +
            "END AS loudounumber " +
            "FROM pb9_transferorder t " +
            "WHERE t.orderno = '" + orderno + "') AS loudounumber " +
    "FROM pb9_transferorder t " +
    "LEFT JOIN pb4_orderplan n ON t.orderno = n.orderno " +
    "LEFT JOIN pb4_eighthoursplan e ON n.planno = e.otno " +
    "LEFT JOIN pub_stackforls s ON t.oldstackname = s.stackname " +
    "WHERE t.orderno = '" + orderno + "'";



WITH OldWarehouseCodes AS (
    SELECT 
        LISTAGG(r.id, ',') WITHIN GROUP (ORDER BY s.lvl) AS oldwdcodes
    FROM (
        SELECT 
            TRIM(REGEXP_SUBSTR(:oldwdname, '[^,]+', 1, LEVEL)) AS wdname,
            LEVEL AS lvl
        FROM DUAL
        CONNECT BY LEVEL <= LENGTH(:oldwdname) - LENGTH(REPLACE(:oldwdname, ',', '')) + 1
    ) s
    JOIN pub_warehousedoor r ON r.wdname = s.wdname
),
NewWarehouseCodes AS (
    SELECT 
        LISTAGG(r.id, ',') WITHIN GROUP (ORDER BY s.lvl) AS newwdcodes
    FROM (
        SELECT 
            TRIM(REGEXP_SUBSTR(:newwdname, '[^,]+', 1, LEVEL)) AS wdname,
            LEVEL AS lvl
        FROM DUAL
        CONNECT BY LEVEL <= LENGTH(:newwdname) - LENGTH(REPLACE(:newwdname, ',', '')) + 1
    ) s
    JOIN pub_warehousedoor r ON r.wdname = s.wdname
)

SELECT 
    n.state,
    t.createtime,
    t.createman,
    t.truckcompany,
    t.cargoname,
    ps_old.code AS oldstackcode,
    OldWarehouseCodes.oldwdcodes,
    ps_old.type AS oldstacktype,
    t.orderno,
    t.outformno,
    t.blno,
    t.informno,
    t.remark,
    n.planno,
    t.shipname,
    t.planweight,
    NewWarehouseCodes.newwdcodes,
    ps_new.code AS newstackcode,
    ps_new.type AS newstacktype,
    n.truckno,
    t.regidno,
    t.dibangnumber,
    t.loadometerno,
    e.classes,
    CASE 
        WHEN t.loudounumber IS NULL THEN NULL
        ELSE LISTAGG(TRIM(REGEXP_SUBSTR(t.loudounumber, '[^,]+', 1, LEVEL)), ',') 
             WITHIN GROUP (ORDER BY LEVEL)
    END AS loudounumber
FROM 
    pb9_transferorder t
LEFT JOIN pb4_orderplan n ON t.orderno = n.orderno
LEFT JOIN pb4_eighthoursplan e ON n.planno = e.otno
LEFT JOIN pub_stackforls ps_old ON t.oldstackname = ps_old.stackname
LEFT JOIN pub_stackforls ps_new ON t.nowstackname = ps_new.stackname
CROSS JOIN OldWarehouseCodes
CROSS JOIN NewWarehouseCodes
WHERE 
    t.orderno = :orderno;
