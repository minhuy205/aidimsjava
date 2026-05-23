const { execSync } = require('child_process');
const fs = require('fs');

const COLLECTION_PATH = './tests/aidims_collection.json';
const ENV_PATH = './tests/environment.json';
const REPORT_PATH = './newman-report.json';

console.log('🚀 [CI/CD Local] Bắt đầu quy trình tự động hóa...');

// 1. Kiểm tra các tệp tin cấu hình Postman
if (!fs.existsSync(COLLECTION_PATH)) {
    console.error(`❌ Lỗi: Không tìm thấy file Postman Collection tại ${COLLECTION_PATH}`);
    process.exit(1);
}

// 2. Chạy test Postman bằng Newman
console.log('🤖 Bước 1: Đang chạy API test từ Postman...');
let testSuccess = true;
try {
    const envParam = fs.existsSync(ENV_PATH) ? `-e ${ENV_PATH}` : '';
    execSync(`npx newman run ${COLLECTION_PATH} ${envParam} --reporters cli,json --reporter-json-export ${REPORT_PATH}`, { stdio: 'inherit' });
    console.log('✅ Bước 1: Tất cả testcases đều PASS.');
} catch (error) {
    console.log('⚠️ Bước 1: Phát hiện một số testcases bị thất bại (FAIL).');
    testSuccess = false;
}

// 3. Gọi Script đồng bộ kết quả lên Jira (Log Bug hoặc Auto-Close Bug)
console.log('🔄 Bước 2: Đồng bộ kết quả lên Jira...');
try {
    execSync('node ./scripts/jira-sync.js', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Lỗi khi đồng bộ lên Jira:', error.message);
    process.exit(1);
}

// 4. Quyết định đẩy code lên GitHub (ĐÃ VÔ HIỆU HÓA tự động commit/push theo yêu cầu của lập trình viên)
if (testSuccess) {
    console.log('🚀 Bước 3: Test thành công! (Tự động commit/push đã được tắt theo thiết lập bảo mật).');
    /*
    try {
        // Lấy tên branch hiện tại
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        console.log(`📌 Branch hiện tại: ${currentBranch}`);

        // Chạy lệnh Git add, commit và push
        console.log('📦 Đang đóng gói (git add & commit)...');
        execSync('git add .', { stdio: 'inherit' });
        
        // Tránh lỗi nếu không có gì thay đổi để commit
        try {
            execSync('git commit -m "auto-commit: API tests passed, syncing code to GitHub"', { stdio: 'inherit' });
        } catch (e) {
            console.log('ℹ️ Không có thay đổi nào mới để commit.');
        }

        console.log(`📤 Đang đẩy code lên GitHub (git push origin ${currentBranch})...`);
        execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });
        console.log('🎉 ĐÃ ĐẨY CODE LÊN GITHUB THÀNH CÔNG!');
    } catch (error) {
        console.error('❌ Lỗi khi thực hiện các lệnh Git:', error.message);
        process.exit(1);
    }
    */
} else {
    console.log('🛑 QUY TRÌNH DỪNG LẠI: Phát hiện API test bị lỗi. Code KHÔNG được đẩy lên GitHub.');
    console.log('👉 Vui lòng kiểm tra lỗi trên bảng Jira, sửa code và chạy lại quy trình.');
    process.exit(1);
}
