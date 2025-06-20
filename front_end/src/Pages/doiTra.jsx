import React,{ useState, useEffect } from 'react';
import { Phone, Mail, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ReturnExchangePolicy = () => {
    const { t } = useTranslation();
    const policyData = [
        {
            product: "Điện thoại/ Máy tính bảng/ Macbook",
            newStandard: "30 ngày",
            oldStandard: "30 ngày",
            newPremium: "20%",
            oldPremium: "15%",
            newOutside: "Thoả thuận",
            oldOutside: "Thoả thuận"
        },
        {
            product: "Apple watch",
            newStandard: "30 ngày",
            oldStandard: "30 ngày",
            newPremium: "20%",
            oldPremium: "20%",
            newOutside: "Thoả thuận",
            oldOutside: "Thoả thuận"
        },
        {
            product: "Samsung watch",
            newStandard: "30 ngày",
            oldStandard: "30 ngày",
            newPremium: "30%",
            oldPremium: "30%",
            newOutside: "Thoả thuận",
            oldOutside: "Thoả thuận"
        },
        {
            product: "Laptop",
            newStandard: "30 ngày",
            oldStandard: "30 ngày",
            newPremium: "20%",
            oldPremium: "Không áp dụng",
            newOutside: "Không áp dụng",
            oldOutside: "Không áp dụng"
        },
        {
            product: "Phụ kiện < 1 triệu",
            newStandard: "1 năm",
            oldStandard: "30 ngày",
            newPremium: "Không áp dụng",
            oldPremium: "Không áp dụng",
            newOutside: "Không áp dụng",
            oldOutside: "Không áp dụng"
        },
        {
            product: "Phụ kiện > 1 triệu",
            newStandard: "15 ngày",
            oldStandard: "15 ngày",
            newPremium: "Không áp dụng (*)",
            oldPremium: "Không áp dụng (*)",
            newOutside: "Không áp dụng (**)",
            oldOutside: "Không áp dụng (**)"
        },
        {
            product: "Bảo hành mở rộng",
            newStandard: "15 ngày",
            oldStandard: "15 ngày",
            newPremium: "50% (***)",
            oldPremium: "50% (***)",
            newOutside: "Không áp dụng",
            oldOutside: "Không áp dụng"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    CHÍNH SÁCH HỦY GIAO DỊCH, ĐỔI TRẢ HÀNG
                </h1>

                {/* Section I: Chính sách hủy giao dịch */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        I. Chính sách hủy giao dịch
                    </h2>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">1. Điều kiện hủy giao dịch:</h3>
                        <p className="text-gray-600 mb-4">
                            Khách hàng có thể hủy giao dịch kể từ lúc bấm nút "Đặt hàng" đến trước thời điểm nhận hàng thành công
                        </p>

                        <h3 className="font-semibold text-gray-700 mb-2">2. Phương thức hủy giao dịch:</h3>
                        <p className="text-gray-600 mb-3">
                            - Sau khi đặt hàng thành công, khi muốn hủy giao dịch, quý khách hàng vui lòng:
                        </p>

                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    <span>Gọi điện thoại lên tổng đài:</span>
                                    <span className="font-semibold text-red-600">1800 2097</span>
                                    <span>(Miền Nam) hoặc</span>
                                    <span className="font-semibold text-red-600">1800 2044</span>
                                    <span>(Miền Bắc)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span>hoặc email đến</span>
                                <a href="mailto:cskh@cellphones.com.vn" className="text-blue-600 underline font-semibold">
                                    cskh@cellphones.com.vn
                                </a>
                                <span>hoặc nhắn tin trên fanpage:</span>
                                <a href="#" className="text-blue-600 underline">Cellphones - Hệ thống bán lẻ di động toàn quốc</a>
                                <span>để bảo hủy giao dịch</span>
                            </div>
                        </div>

                        <p className="text-gray-600 mt-3">
                            - Từ chối nhận hàng và xác nhận hủy mua sản phẩm khi bên vận chuyển giao hàng
                        </p>
                    </div>
                </div>

                {/* Section II: Chính sách đổi, trả hàng */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        II. Chính sách đổi, trả hàng
                    </h2>

                    <h3 className="font-semibold text-gray-700 mb-4">1. Thời gian đổi trả:</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm">
                            <thead>
                                <tr className="bg-green-100">
                                    <th className="border border-gray-300 p-3 text-center font-semibold" rowSpan={2}>
                                        Thời gian
                                    </th>
                                    <th className="border border-gray-300 p-3 text-center font-semibold" colSpan={2}>
                                        Thời gian đổi mới tiêu chuẩn
                                    </th>
                                    <th className="border border-gray-300 p-3 text-center font-semibold" colSpan={2}>
                                        Trong thời gian tiêu chuẩn
                                    </th>
                                    <th className="border border-gray-300 p-3 text-center font-semibold" colSpan={2}>
                                        Ngoài thời gian tiêu chuẩn
                                    </th>
                                </tr>
                                <tr className="bg-green-50">
                                </tr>
                                <tr className="bg-green-50">
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Loại sản phẩm</th>
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Mới</th>
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Cũ</th>
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Mới</th>
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Cũ</th>
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Mới</th>
                                    <th className="border border-gray-300 p-2 text-center text-sm font-medium">Cũ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policyData.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="border border-gray-300 p-3 text-left">{item.product}</td>
                                        <td className="border border-gray-300 p-2 text-center text-sm">{item.newStandard}</td>
                                        <td className="border border-gray-300 p-2 text-center text-sm">{item.oldStandard}</td>
                                        <td className="border border-gray-300 p-2 text-center text-sm">{item.newPremium}</td>
                                        <td className="border border-gray-300 p-2 text-center text-sm">{item.oldPremium}</td>
                                        <td className="border border-gray-300 p-2 text-center text-sm">{item.newOutside}</td>
                                        <td className="border border-gray-300 p-2 text-center text-sm">{item.oldOutside}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                        <p>(*) Airpod nhập trả trừ 20%.</p>
                        <p>(**) Airpod nhập theo giá thoả thuận.</p>
                        <p>(***) BHMR nhận trả trong vòng 7 ngày đầu.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnExchangePolicy;