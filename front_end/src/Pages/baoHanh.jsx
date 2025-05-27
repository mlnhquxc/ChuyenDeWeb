import React from 'react';
import { Clock, Shield, AlertCircle, CheckCircle, Phone, Globe } from 'lucide-react';

const WarrantyPolicy = () => {
    const warrantyData = [
        {
            product: "Máy mới",
            period: "12 tháng/Đôi đã hết theo quy định của hãng",
            decision: "Quyền lợi bảo hành của hãng",
            location: "TTBH chính hãng"
        },
        {
            product: "Máy đã kích hoạt bảo hành online",
            period: "12 tháng - Thời gian bảo hành còn tại lúc mua hàng tại Cellphones",
            decision: "Theo quyền lợi bảo hành của hãng trong thời gian còn lại",
            location: "TTBH chính hãng & Cellphones/ Điện Thoại Vui"
        },
        {
            product: "Máy cũ",
            period: "6 tháng",
            decision: "Sửa chữa, thay thế linh kiện",
            location: "Cellphones/ Điện Thoại Vui"
        }
    ];

    const warrantyConditions = [
        "Trong 30 ngày đầu nhập lại máy, trừ phí 20% tiền gốc khi hóa đơn (không áp dụng máy như giao hàng nhập lại hưng lễ)",
        "Sau 30 ngày nhập lại máy theo giá thỏa thuận"
    ];

    const exclusions = [
        "Máy vỡ, cố hỏng trang sản phẩm như lúc mới mua",
        "Máy khó nhỏ, khiếng máy mức, nâu, rỉ sét tẩu rỉ, đứt, quần hàng dạn, sạc ở Central thời kinh hợp cây nhãn màu",
        "Phu kiện kỹ thuật thay chia số thuộc không giống máy cơ bình thường hay hay hưng xuất không đúng mùi động",
        "Tất khóa: Máy đã rẻ đăng đăng xuất rồi rốt rỉ các ta khôi khôa máy, iCloud, Google Account, Mi Account..."
    ];

    const additionalNotes = [
        "Ngoài bảo hành khoa cam kết đổi mới trong 30 ngày theo theo qua thỏa thuận",
        "(*) Để có giá thả tiện xuất té cần để khôi phẩm tôi gốp gồm, hư tiện mainboard & trong, màn hình và các linh kiện phần cứng lắp trong",
        "Vì để đảc thái khi hưng này tôi số mãi hưng có ở tậu chữ trễn hay không thỏa mãi để kích thước tôn hem trong"
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    CHÍNH SÁCH BẢO HÀNH SẢN PHẨM
                </h1>
                <p className="text-center text-gray-600 text-sm mb-8">
                    (*) Đối mới 30 ngày miễn phí
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-gray-700 text-sm">
                        Sản phẩm mua hãng tại Cellphones.com.vn, khách hàng có quyền yêu cầu với chính sách đổi mới miễn phí tôi tối 30 ngày
                    </p>
                </div>

                {/* Warranty Table */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Bảo hành tiêu chuẩn
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="border border-gray-300 p-3 text-left font-semibold">Sản phẩm</th>
                                    <th className="border border-gray-300 p-3 text-left font-semibold">Thời gian bảo hành</th>
                                    <th className="border border-gray-300 p-3 text-left font-semibold">Quyền lợi bảo hành</th>
                                    <th className="border border-gray-300 p-3 text-left font-semibold">Địa chỉ bảo hành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warrantyData.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="border border-gray-300 p-3">{item.product}</td>
                                        <td className="border border-gray-300 p-3">{item.period}</td>
                                        <td className="border border-gray-300 p-3">{item.decision}</td>
                                        <td className="border border-gray-300 p-3">{item.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Categories */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Điện thoại (Apple/Samsung/Xiaomi/OPPO/Vivo/Realme/Nokia/Macbook/Apple watch)
                        </h3>
                        <p className="text-sm text-green-700 mb-2">30 ngày</p>
                        <ul className="text-sm text-green-700 space-y-1">
                            {warrantyConditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800 mb-3">Samsung watch</h3>
                        <p className="text-sm text-purple-700 mb-2">30 ngày</p>
                        <ul className="text-sm text-purple-700 space-y-1">
                            {warrantyConditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="font-semibold text-orange-800 mb-3">Laptop</h3>
                        <p className="text-sm text-orange-700 mb-2">30 ngày</p>
                        <ul className="text-sm text-orange-700 space-y-1">
                            {warrantyConditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">Phụ kiện</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-gray-700"> 1 triệu (Sản phẩm mua mới):</p>
                                <p className="text-xs text-gray-600">1 năm</p>
                                <p className="text-xs text-gray-600">Không áp dụng nhập lại</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700"> 1 triệu (Sản phẩm mua cũ):</p>
                                <p className="text-xs text-gray-600">Không áp dụng nhập lại</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extended Warranty */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Phụ kiện 1 triệu
                    </h3>
                    <p className="text-sm text-yellow-700 mb-2">15 ngày</p>
                    <p className="text-sm text-yellow-700">
                        Trong 30 ngày đầu nhập lại máy, trừ phí 20% tiền gốc khi hóa đơn (không áp dụng máy như giao hàng nhập lại hưng lễ)
                    </p>
                    <p className="text-sm text-yellow-700">
                        Sau 30 ngày nhập lại máy theo giá thỏa thuận
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />Bảo hành mở rộng
                    </h3>
                    <p className="text-sm text-red-700 mb-2">15 ngày</p>
                    <p className="text-sm text-red-700">Trong 7 ngày đầu, máy không lỗi, khách hàng trả lại gói BHMR - hoàn lại 50% giá gói BHMR
                    </p>
                </div>

                {/* Exclusions */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Lưu ý phẩm cùng cơ phần nhà sản xuất
                    </h3>
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <h4 className="font-semibold text-red-800 mb-2">Điều kiện đổi lại:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• Sản phẩm trong tình trạng nguyên vẹt, không bảo thiết, hình dạng lúc</li>
                            {exclusions.map((exclusion, index) => (
                                <li key={index}>• {exclusion}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ngoài bảo hành khoa:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="text-sm text-gray-700 space-y-2">
                            {additionalNotes.map((note, index) => (
                                <li key={index}>• {note}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Warranty Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3">1. Điều khóa, LapTop:</h3>
                        <p className="text-sm text-blue-700 mb-2">
                            Các sản phẩm điện thoại Máy khách có thể bội cac TTBH chính hãng hoặc được theo máy gồm bao gồm chính hãng.
                        </p>
                        <p className="text-sm text-blue-700">
                            Các sẩm bảo hành khôi thỏo quy định của hưng hãng, các tiết có trong bằng sau:
                        </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-3">Warranty Centers:</h3>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• Trung tâm bảo hành các các hãng, quy khách có thể xem chi tiết tại: https://cellphones.com.vn/bao-hanh/apple</li>
                            <li>• Trung thời gian quy hóa hành: sấu chữa, khách hàng sẽ được hưởng lại máy miễn chí thuật khác đã sử dụng</li>
                            <li>• Khách hàng có thể mây 24 nhượm sau khi nhất âm tại máy chắc mình.</li>
                        </ul>
                    </div>
                </div>

                {/* Warranty Duration */}
                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Quy định bảo hành phụ kiện theo kèm mày:
                    </h3>
                    <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• Vinsmart: 6 tháng</li>
                        <li>• Asus: 6 tháng</li>
                        <li>• Nokia: 6 tháng</li>
                    </ul>
                    <p className="text-xs text-indigo-600 mt-2">
                        Quyền lợi bảo hành đổi sự phải sau trí: 1 đổi đên cả các lỗi
                    </p>
                </div>

                {/* Contact */}
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        Điệm chi tiết TTBH chính hãng
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        Click vào đổi âm đã ớt
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WarrantyPolicy;