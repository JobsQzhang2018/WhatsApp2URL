# WhatsApp 链接生成器

![WhatsApp Logo](https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg){: width="200" }

一个简单易用的工具，用于生成WhatsApp聊天链接，支持单号码和批量处理模式。

## 功能特性

- ✅ 单号码快速生成
-  批量处理多号码
-  标准WhatsApp链接格式（api.whatsapp.com）
-  响应式设计，适配各种设备
-  一键复制/导出结果
-  自动识别无效号码

## 使用说明

### 单号码模式
1. 在输入框输入完整电话号码（含国家代码）
   - 示例：`8619913897355` 或 `+86 199 1389 7355`
2. 点击"生成链接"按钮
3. 获取可直接使用的WhatsApp链接

### 批量模式
1. 切换到"批量模式"
2. 在文本框中每行输入一个号码
   - 支持从Excel/CSV直接粘贴
3. 点击"批量生成"按钮
4. 查看处理结果表格
5. 可复制全部有效链接或导出为CSV

## 技术架构

```plaintext
whatsapp-link-generator/
├── index.html          # 主界面
├── script.js           # 核心逻辑
├── style.css           # 样式表
── README.md           # 说明文档
