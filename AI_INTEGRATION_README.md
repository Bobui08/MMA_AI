# AI Tools Integration với App Data

## Tổng quan

Tôi đã tích hợp dữ liệu của app Wellness Journey vào các AI tools (Ask AI và Chat AI) để AI có thể hiểu context và cung cấp phản hồi cá nhân hóa dựa trên dữ liệu mood tracking của người dùng.

## Các thay đổi đã thực hiện

### 1. AppDataService (`utils/appDataService.ts`)
- **Mục đích**: Thu thập và xử lý dữ liệu từ toàn bộ app để cung cấp context cho AI
- **Chức năng chính**:
  - `getAppContext()`: Thu thập tất cả dữ liệu mood entries, stats, trends
  - `generateSystemPromptWithContext()`: Tạo system prompt chi tiết với context app
  - `generateChatContext()`: Tạo context ngắn gọn cho chat messages
  - `analyzeMoodTrends()`: Phân tích xu hướng tâm trạng theo tuần
  - `generateEmotionalInsights()`: Tạo insights về cảm xúc

### 2. API Completion (`app/api/completion+api.ts`)
- **Thay đổi**: Tích hợp AppDataService để tạo system prompt với context
- **Tính năng mới**: 
  - Tham số `includeAppContext` để bật/tắt context
  - Fallback mechanism nếu context generation thất bại
  - Error handling tốt hơn

### 3. API Chat (`app/api/chat+api.ts`)
- **Thay đổi**: Tích hợp AppDataService cho cả system prompt và message context
- **Tính năng mới**:
  - Tham số `includeAppContext` để bật/tắt context
  - Thêm context vào tin nhắn đầu tiên của user
  - Fallback mechanism và error handling

### 4. Ask AI Page (`app/ask.tsx`)
- **UI mới**: Toggle switch để bật/tắt app context
- **Tính năng**: 
  - Người dùng có thể chọn có sử dụng context app hay không
  - Hiển thị thông tin về việc AI có access vào dữ liệu mood
  - Gửi `includeAppContext` parameter đến API

### 5. Chat AI Page (`app/chat.tsx`)
- **UI mới**: Toggle switch để bật/tắt app context
- **Tính năng**:
  - Người dùng có thể chọn có sử dụng context app hay không
  - Hiển thị thông tin về việc AI có access vào dữ liệu mood
  - Gửi `includeAppContext` parameter đến API

### 6. Styles Updates
- **ask.ts**: Thêm styles cho context toggle và info text
- **chat.ts**: Thêm styles cho context toggle và info text

## Context Data được cung cấp cho AI

### System Prompt bao gồm:
1. **App Stats**:
   - Tổng số mood entries
   - Current streak (chuỗi ngày tracking liên tiếp)
   - Tâm trạng phổ biến nhất tuần này
   - Số entries được highlight

2. **Recent Mood Entries** (5 entries gần nhất):
   - Ngày, tâm trạng, và nội dung text

3. **Highlighted Important Entries** (3 entries quan trọng):
   - Các entries mà user đã đánh dấu quan trọng

4. **Emotional Insights**:
   - Phân tích về streak, tâm trạng phổ biến, v.v.

5. **Mood Trends**:
   - So sánh tâm trạng tuần này vs tuần trước

### Chat Context bao gồm:
- Thông tin tóm tắt về app data được thêm vào tin nhắn đầu tiên

## Cách sử dụng

### Cho người dùng:
1. Mở Ask AI hoặc Chat AI
2. Bật/tắt toggle "Use app data context" theo nhu cầu
3. Khi bật: AI sẽ hiểu về mood entries và có thể đưa ra lời khuyên cá nhân hóa
4. Khi tắt: AI hoạt động như assistant thông thường

### Ví dụ câu hỏi có thể hỏi khi bật context:
- "Phân tích tâm trạng của tôi tuần này"
- "Tôi có xu hướng cảm xúc như thế nào?"
- "Đưa ra lời khuyên dựa trên mood entries gần đây của tôi"
- "Tại sao tôi highlight những entries đó?"

## Lợi ích

1. **Cá nhân hóa**: AI hiểu rõ hơn về journey cảm xúc của user
2. **Relevant advice**: Lời khuyên dựa trên dữ liệu thực tế
3. **Pattern recognition**: AI có thể nhận diện patterns trong mood
4. **Contextual support**: Hỗ trợ dựa trên tình trạng hiện tại của user
5. **Privacy control**: User có thể chọn khi nào chia sẻ data với AI

## Technical Notes

- Service sử dụng Redux store để access real-time data
- Error handling đảm bảo app không crash nếu context generation fails
- Context được generate mỗi lần gọi API để đảm bảo data mới nhất
- UI responsive với toggle switches và info text
