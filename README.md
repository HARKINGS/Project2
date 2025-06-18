# WEB

- Toàn bộ thông tin, quá trình lập trình, thiết kế, làm việc sẽ được lưu tại đây

# Trương Minh Ngọc

## 16/03/2025

### Đã làm được

- Chỉnh sửa phần User Controller
- Hoàn thiện thêm code của File service, với Permission, Role
- Code các chức năng cho Permission, Role (thêm, xoá, xem toàn bộ)
- Xử lý các exception thông qua code file exception
- Thêm repository (RoleRepository, PermissionRepository)
- Hoàn thiện DTO (Data transfer Object)
- Thêm Validator cho xử lý exception về độ tuổi (Thuận tiện hoá thay đổi độ tuổi xử lý)

### Chưa làm được

- Chức năng login, logout do chưa đủ thời gian

### Dự kiến tương lai

- Thực hiện chức năng login/logout và tiếp tục code tiếp backend, sau đó sẽ code frontend

## 23/03/2025

### Đã làm được

- Merge code, xử lý xung đột code 2 người back end
- Bước đầu code login, logout

### Chưa làm được

- Chưa xong login logout (Do chưa có thời gian, làm muộn)

### Dự kiến tương lai

- Hoàn thiện login, logout trong tuần tới

## 30/03/2025

### Đã làm được

- Code xong phần ConFigure cho code
  - Điều chỉnh việc thêm tài khoản admin khi chưa có
  - Xử lý các request chưa được xác thực
  - Hoàn thiện phần login/logout
- Hoàn thiện phần controller, phần code đã ổn định với việc quản lý tài khoản

### Chưa làm được

- Trong quá trình chạy lại để kiểm tra, lại phát sinh lỗi
  - Mặc dù run được, nhưng các request đều bị lỗi Unauthorized!
- Nguyên nhân vẫn đang tìm kiếm, nhưng đây có thể là lỗi về mặt phân quyền

### Dự kiến tương lai

- Sửa lỗi đang mắc phải
- Phát triển tiếp phần Front End
- Tìm hiểu RAG

## 06/04/2025

### Đã làm được

- Chỉnh sửa lỗi 1 số truy vấn như login, create account, get info, get account,...
- Tạo thêm, cập nhập báo cáo ở file README.md
- (1 thành viên khác) Code them phần goodsReview, infoBuy, OrderItem, ...

## 12/04/2025

### Đã làm được

- Code phân quyền cho các vai trò
- Các vai trò user, staff, admin đều có quyền thực hiện 1 số chức năng chung, admin sẽ sở hữu nhiều quyền nhất, rồi tới staff, cuối cùng là user
- Chạy thử đã ổn định các chức năng, API chính liên quan đến quản lý tài khoản, vai trò, quyền

### Chưa làm được

- Hiểu sâu về RAG
- Code front end

### Dự kiến tương lai

- Tìm hiểu và áp dụng RAG vào code
- Code front end

## 20/04/2025

### Đã làm được

- Thực hiện up database lên cloud (= railway, tuy nhiên cloud của railway lại chỉ chấp nhận version java-17)
- Hoan thiện, chỉnh sửa, đổi tên Review thành GoodsReview, cùng các class liên quan
- Đã tìm hiểu về RAG, LLM (Language Model và Large Language Model), transformers
- Bắt đầu tiến hành làm báo cáo

### Chưa làm được

- Hoàn thiện báo cáo
- Code xong RAG

### Dự kiến

- Tiếp tục code hoàn thiện Backend, code Frontend

## 27/04/2025

### Đã làm được

- Thực hiện thêm thuộc tính cho Voucher như hạn sử dụng, ...
- Tạo mapper, service, controller cho service
- Khởi tạo các dependency cho chat bot RAG ở 1 file chạy thử, tuy nhiên chatbot RAG spring boot em vẫn chưa nghĩ cách nào dùng cho mysql, hiện em cần chuyển sang postgresql để chạy với pgvector

### Chưa làm được

- Lỗi trong quá trình chạy code (do cài lại win, giờ lại gặp vấn đề về code)
- Code chưa xong backend, có lẽ cần phai chỉnh sửa code toàn diện về Voucher
- Vẫn chưa hoàn thiện được chatbot RAG

### Dự tính tương lai

- Khắc phục lỗi code
- Tạo các giao diện front end
- Làm tiếp báo cáo
- Hoàn thành chatbot

## 04/05/2025

### Đã làm được

- Chuyển đổi cơ sở dữ liệu từ mysql sang postgresql
- Hoàn thiện chức năng của Voucher
- Tích hợp RAG vào phần mềm
- Khởi tạo được giao diện đăng nhập

### Chưa làm được

- Code RAG chưa chạy được (Do lỗi về các bảng)
- Chưa hoàn thiện được giao diện Front End

### Dự tính tương lai

- Sửa code RAG
- Làm tiếp giao diện Front End

## 11/05/2025

### Đã làm đươợc

- Chỉnh sửa id của các entity

### Chưa làm được

- Lỗi khi thêm cac class thanh toan
- RAG chưa chạy tốt
- Tuan này em đang bị vướng BTL của nhiều mon, mong thầy thông cảm ạ

### Dự kiến tương lai

- Khắc phục lỗi
- Xây dựng Front End

## 18/05/2025

### Đã làm được

- Chỉnh sửa các lỗi truy vấn order, goods
- Thêm mới các chức năng tim kiếm sản phẩm theo tên, theo hàng, sắp xếp sản phẩm theo thứ tự
- Tạo file chứa các API

### Chưa làm được

- Tạo ra giao diện mới (FE - do tuần sau em phải báo cáo BTL nhiều môn nên chưa làm xong)
- Chưa tạo được file báo cáo

### Dự kiến tương lai

- Hoàn thành code giao diện FE
- Tạo báo cáo
- Deploy dự án

## 01/06/2025

### Đã làm được

- Tạo thêm giao diện thông tin sản phẩm (USER)
- Chỉnh sửa giỏ hàng, thêm tính năng chỉnh sửa số lượng sản phẩm (USER)
- Chỉnh sửa Trang chủ, bỏ đi tính năng hiện checkout ở cuối trang (USER)

### Chưa làm được

- Chưa tạo được giao diện của ADMIN và STAFF
- Chưa kết nối được giao diện FE với BE (chưa làm tới)

### Dự kiến tương lai

- Tạo giao diện cho quản trị viên
- Kết nối FE với BE, bắt API
- Làm thêm báo cáo

## 08/06/2025

### Đã làm được

- Tạo thêm giao diện lịch sử mua bán cho user
- Giờ tất cả tài khoản phải đăng nhập thì mới có thể mua hàng
- Bắt API đăng nhập cho cả 3 vai trò ADMIN, STAFF, USER

### Chưa làm được

- Điều chỉnh chat bot hoàn hảo (Đang tham khảo nhiều nguồn)
- Hoàn thành web (Vẫn chưa xong phần kết nối API BE -> FE)
- Tạo báo cáo (Thời gian này phải ôn thi môn Kỹ thuật lập trình)

### Dự kiến tương lai

- Kết nối API hoàn thiện
- Tạo báo cáo Bài tập lớn