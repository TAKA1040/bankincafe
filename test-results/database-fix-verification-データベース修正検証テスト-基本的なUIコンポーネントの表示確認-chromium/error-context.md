# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "データベース接続テスト" [level=1] [ref=e3]
    - generic [ref=e4]:
      - paragraph [ref=e5]: "成功: 2214件の請求書が見つかりました"
      - paragraph [ref=e6]: "サンプル件数: 5"
      - generic [ref=e7]: "[ { \"invoice_id\": \"25043369-1\", \"customer_name\": \"UDトラックス株式会社\" }, { \"invoice_id\": \"25090001-1\", \"customer_name\": \"株式会社UDトラックス\" }, { \"invoice_id\": \"22011376-1\", \"customer_name\": \"UDトラックス株式会社\" }, { \"invoice_id\": \"22011377-1\", \"customer_name\": \"UDトラックス株式会社\" }, { \"invoice_id\": \"22011378-1\", \"customer_name\": \"UDトラックス株式会社\" } ]"
    - link "請求書一覧に戻る" [ref=e9] [cursor=pointer]:
      - /url: /invoice-list
  - alert [ref=e10]
```