# 🌐 NewExchangeRatesTable / 每日汇率表

> A GitHub Action workflow to fetch exchange rates daily across multiple platforms.\
> 一个通过 GitHub Action 工作流每日拉取各个平台汇率的仓库。

---

## 📦 功能 Features

- 🕑 **每日定时**：自动在 GitHub Action 中安排任务，每天定时执行。\
  **Scheduled**: Use GitHub Actions to run at a fixed time every day.
- 💱 **多平台支持**：一次性拉取来自多个汇率服务商的数据。\
  **Multi-Source**: Fetch rates from various exchange rate APIs in one go.
- 📊 **生成数据**：将抓取到的汇率数据基于 USD 价格生成 JSON，方便开发者灵活调用。\
  **Markdown Table**: Formats data into a clear, shareable table.
- 🔄 **仓库更新**：自动将生成的汇率表提交回仓库，保持历史记录。\
  **Auto Commit**: Push updated tables back to repo, preserving history.

---

## 🏃‍♂️ 使用 Usage

- 每日自动拉取 3 次，无需手动触发。\
  Runs everyday automatically; manual dispatch also supported.

