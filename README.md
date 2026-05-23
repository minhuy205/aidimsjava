# 🏥 AI-based Diagnostic Imaging Management System (AIDIMS)

## 📌 Overview
AIDIMS is a medical web application designed to manage patient records, diagnostic imaging, and AI-assisted analysis.  
The system provides functionalities for **staff, doctors, technicians, and administrators**.

### 🛠️ Technology Stack
- **Backend**: Java Spring Boot  
- **Frontend**: React / Next.js / Angular / JavaScript (option)  
- **AI Integration**: DICOM image analysis  
- **Deployment**: Web App  

---

## 👥 User Roles & Features

### 👩‍💼 Staff (Receptionist)
- Create and update patient profiles.  
- Record patient symptoms.  
- Assign patients to suitable doctors based on symptoms and specialty.  

### 👨‍⚕️ Doctor
- View patient records and request imaging.  
- Analyze DICOM images.  
- Receive AI analysis results and make final diagnosis.  
- Annotate and add notes to images.  
- Compare patient images across time.  
- Generate diagnostic reports.  

### 🧑‍🔬 Imaging Technician
- Import images from imaging devices into the system.  
- Check image quality and re-capture if needed.  
- Assign images to patients and add related information.  

### 👨‍💻 System Administrator *(under development)*
- Manage user accounts.  
- Monitor system activities.  
- Configure system parameters and AI models.  

---

## 🚀 Getting Started

### 1. Backend (Spring Boot)
``bash
cd aidims-backend
mvn clean install
mvn spring-boot:run

###  2. Frontend (React)
''bash
cd aidims-frontend
npm install
npm install react-konva use-image react-modal
npm start
```

---

## 🤖 CI/CD Automations: Jira Integration & API Testing

Dự án này tích hợp quy trình CI/CD tự động chạy API test của Postman và cập nhật các lỗi hoặc trạng thái giải quyết trực tiếp lên dự án Jira của bạn.

### ⚙️ Quy trình hoạt động
1. **Trigger**: Khi nhà phát triển push code hoặc tạo Pull Request lên nhánh `master`, `main` hoặc `dev`.
2. **Build**: GitHub Actions khởi chạy dịch vụ MySQL, import dữ liệu từ `aidims.sql`, và build/khởi chạy backend Spring Boot (`port 8080`).
3. **Test**: Công cụ **Newman** tự động chạy bộ kiểm thử API lưu trong file [aidims_collection.json](file:///tests/aidims_collection.json) với môi trường [environment.json](file:///tests/environment.json).
4. **Jira Sync**: Script Node.js [jira-sync.js](file:///scripts/jira-sync.js) tự động:
   - **Log Bug**: Nếu có assertion thất bại, tự động tìm kiếm trên Jira. Nếu chưa có lỗi tương tự, tạo mới một issue dạng `Bug` với đầy đủ vết log lỗi.
   - **Fix/Đóng Bug**: Nếu tất cả các test cases vượt qua thành công, script sẽ tự động tìm các issue lỗi do CI tạo trước đó và chuyển trạng thái của chúng sang `Done`, đồng thời ghi nhận bình luận (comment) đã sửa lỗi thành công.

### 🔑 Cách cấu hình môi trường
Để tính năng tự động hóa hoạt động, hãy cấu hình các thông số bảo mật trong repository GitHub của bạn (**Settings > Secrets and variables > Actions**):

1. `JIRA_DOMAIN`: Địa chỉ tên miền Jira Cloud của bạn (ví dụ: `https://your-domain.atlassian.net`).
2. `JIRA_EMAIL`: Địa chỉ email tài khoản Atlassian dùng để quản trị (ví dụ: `dev@company.com`).
3. `JIRA_TOKEN`: API Token được sinh ra từ Atlassian Account Security Portal.
4. `JIRA_PROJECT_KEY` *(Không bắt buộc)*: Key của dự án Jira cần quản lý (Mặc định sẽ là `TASK` nếu không cấu hình).

### 🛠️ Tệp tin liên quan trong dự án
- **GitHub Workflow**: [.github/workflows/jira-automation.yml](file:///.github/workflows/jira-automation.yml)
- **Automation Script**: [scripts/jira-sync.js](file:///scripts/jira-sync.js)
- **Postman Tests**: [tests/aidims_collection.json](file:///tests/aidims_collection.json)
