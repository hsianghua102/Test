# 揪呷 JoinBite

Mobile-first 聚餐決策 Prototype。使用者可以建立聚餐、分享連結、快速填寫偏好，透過規則產生 3 間候選餐廳，再一起投票完成決定。

## 直接執行

專案不需要安裝依賴：

```bash
python3 -m http.server 8000
```

開啟 <http://localhost:8000>。未設定 Supabase 時，資料會保存在瀏覽器 Local Storage。

## Prototype 流程

1. 建立聚餐與分享連結
2. 填寫發起者偏好
3. 在等待室模擬其他成員完成
4. 依共同預算、飲食限制與料理票數產生 3 間推薦
5. 投票並模擬其他成員投票
6. 查看結果與 Time to Decision

## 連接 Supabase

1. 建立 Supabase Project。
2. 在 SQL Editor 執行 [`supabase.sql`](./supabase.sql)。
3. 到 Project Settings → API 取得 Project URL 與 public anon key。
4. 將資料填入 [`config.js`](./config.js)：

```js
window.JOINBITE_CONFIG = {
  supabase: {
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'YOUR_PUBLIC_ANON_KEY',
  },
};
```

重新整理後，右上角會從「本機 Demo」變成「Supabase」。分享連結即可讓其他裝置加入同一個 Room，狀態更新也會透過 Supabase Realtime 同步。

> `supabase.sql` 的匿名讀寫政策只適合 Prototype。正式產品需加入不可猜測的 room token、權限驗證及更嚴格的 RLS。

## 檔案

- `index.html`：SPA 入口
- `style.css`：Mobile-first 視覺與響應式樣式
- `app.js`：流程狀態、Mock Data、推薦與投票邏輯
- `config.js`：可選的 Supabase 設定
- `supabase.sql`：Prototype table、RLS 與 Realtime 設定
