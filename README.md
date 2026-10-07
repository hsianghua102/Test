# Sift — AI 工作資訊整理助手

一個以 PM／專案管理工作者為核心使用者的互動式 Web Prototype。Sift 將貼入的 Email、Slack 與會議紀錄整理成今日摘要與有優先順序的 Action Items。

## 執行

這是零依賴的純前端 Prototype，可直接開啟 `index.html`，或在專案目錄執行：

```bash
python3 -m http.server 8000
```

再前往 `http://localhost:8000`。

## 可測試流程

- 貼上自由文字，或一鍵載入「跨部門協作」範例
- 查看三階段 AI 分析動畫與今日重點
- 完成、編輯、調整優先順序、刪除及復原待辦
- 在待處理／已完成／全部之間切換
- 從範例選單載入「純資訊公告」或「格式異常內容」，測試無待辦與錯誤狀態
- 支援桌面、平板、手機與鍵盤操作，並尊重 reduced-motion 設定

## 檔案

- `index.html`：產品語意結構與各種狀態
- `style.css`：設計系統、動效與響應式版型
- `app.js`：Mock 分析、狀態管理與所有互動
