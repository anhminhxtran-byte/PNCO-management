import { Header } from '../components/Header';

export function GASSetup() {
  return (
    <div className="h-full flex flex-col">
      <Header title="Google Apps Script Setup" />
      <div className="flex-1 overflow-y-auto space-y-8 pb-12">
        
        {/* Schema Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#194b8e] mb-4">1. Data Schema (Google Sheets)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Tạo các sheet với tên tương ứng và cấu trúc cột (cột A, B, C...) như sau:
          </p>
          <div className="space-y-4 text-sm">
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-bold text-gray-800">Sheet "GiaoDich" (Transactions)</h4>
              <p className="text-gray-600 mt-1">A: ID (String) | B: Ngay (Date) | C: Loai (INCOME/EXPENSE) | D: DanhMuc_ID | E: SoTien (Number) | F: TaiKhoan_ID | G: DoiTuong_ID | H: SoHoaDon | I: NgayHoaDon | J: DaThanhToan (Number) | K: TrangThai (PAID/UNPAID/PARTIAL) | L: GhiChu | M: NhanSu_ID | N: Timestamp</p>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-bold text-gray-800">Sheet "DanhMuc" (Categories)</h4>
              <p className="text-gray-600 mt-1">A: ID (String) | B: Ten_DanhMuc (String) | C: Loai (INCOME/EXPENSE) | D: Icon (Emoji/String) | E: MauSac (Hex) | F: TrangThai_Xoa (TRUE/FALSE)</p>
            </div>
            
             <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-bold text-gray-800">Sheet "DoiTuong" (Targets)</h4>
              <p className="text-gray-600 mt-1">A: ID | B: Loai (CUSTOMER/SUPPLIER) | C: Ten | D: SoDienThoai | E: Email | F: MaSoThue | G: DiaChi | H: NguoiLienHe | I: GhiChu | J: CongNo_HienTai</p>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-bold text-gray-800">Sheet "TaiKhoan" (Accounts)</h4>
              <p className="text-gray-600 mt-1">A: ID | B: Ten_TaiKhoan | C: SoDu_DauKy (Number) | D: SoDu_HienTai (Number)</p>
            </div>
          </div>
        </div>

        {/* GAS Code Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#194b8e] mb-4">2. Code.gs (Backend)</h3>
          <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
{`// Cấu hình ID Spreadsheet
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản lý thu chi')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

// --- QUẢN LÝ DANH MỤC ---
function getCategories() {
  const sheet = getSheet('DanhMuc');
  const data = sheet.getDataRange().getValues();
  // Bỏ qua header (row 1)
  const categories = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] !== true) { // Nếu chưa bị xóa
      categories.push({
        id: data[i][0],
        name: data[i][1],
        type: data[i][2],
        icon: data[i][3],
        color: data[i][4]
      });
    }
  }
  return categories;
}

function addCategory(category) {
  const sheet = getSheet('DanhMuc');
  const id = Utilities.getUuid();
  sheet.appendRow([id, category.name, category.type, category.icon, category.color, false]);
  return { success: true, id: id };
}

// --- QUẢN LÝ GIAO DỊCH ---
function getTransactions(filter) {
  const sheet = getSheet('GiaoDich');
  const data = sheet.getDataRange().getValues();
  const transactions = [];
  for (let i = 1; i < data.length; i++) {
    transactions.push({
      id: data[i][0],
      date: data[i][1],
      type: data[i][2],
      categoryId: data[i][3],
      amount: data[i][4],
      accountId: data[i][5],
      targetId: data[i][6],
      status: data[i][10]
    });
  }
  return transactions;
}

function addTransaction(tx) {
  const sheet = getSheet('GiaoDich');
  const id = Utilities.getUuid();
  const timestamp = new Date();
  
  sheet.appendRow([
    id, tx.date, tx.type, tx.categoryId, tx.amount, tx.accountId, 
    tx.targetId, tx.invoiceNo, tx.invoiceDate, tx.paidAmount, 
    tx.status, tx.notes, tx.personnelId, timestamp
  ]);
  
  // TO-DO: Cập nhật biến động số dư Tài khoản và Công nợ Đối tượng ở đây
  
  return { success: true, id: id };
}
`}
            </pre>
          </div>
        </div>

        {/* Index.html Code Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#194b8e] mb-4">3. Index.html (Frontend Test)</h3>
          <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-sm text-blue-300 font-mono whitespace-pre-wrap">
{`<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <title>Test API</title>
  </head>
  <body>
    <h2>Test thêm Danh mục</h2>
    <button onclick="addMockCategory()">Thêm danh mục mẫu</button>
    <div id="output"></div>

    <script>
      function addMockCategory() {
        const payload = {
          name: 'Tiền mạng',
          type: 'EXPENSE',
          icon: '🌐',
          color: '#0000FF'
        };
        
        google.script.run
          .withSuccessHandler(function(res) {
            document.getElementById('output').innerHTML = 'Thêm thành công! ID: ' + res.id;
          })
          .withFailureHandler(function(err) {
            alert('Lỗi: ' + err.message);
          })
          .addCategory(payload);
      }
    </script>
  </body>
</html>
`}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
