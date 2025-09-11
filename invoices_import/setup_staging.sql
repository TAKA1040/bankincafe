
      CREATE SCHEMA IF NOT EXISTS staging;
      
      DROP TABLE IF EXISTS staging.invoices_import;
      CREATE TABLE staging.invoices_import (
        "請求書番号" TEXT,
        "請求月"     TEXT,
        "請求日"     TEXT,
        "請求先"     TEXT,
        "件名"       TEXT,
        "登録番号"   TEXT,
        "発注番号"   TEXT,
        "オーダー番号" TEXT,
        "小計"       TEXT,
        "消費税"     TEXT,
        "請求金額"   TEXT
      );
    