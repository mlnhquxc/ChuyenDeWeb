import React, { useEffect, useState } from "react";
// Shipping fee calculation based on location
const calculateShippingFee = (province, shippingMethod = 'standard') => {
  const baseFees = {
    standard: 30000,
    express: 50000,
    economy: 20000
  };

  // Major cities with lower shipping fees
  const majorCities = [
    'Thành phố Hà Nội',
    'Thành phố Hồ Chí Minh',
    'Thành phố Đà Nẵng',
    'Thành phố Hải Phòng',
    'Thành phố Cần Thơ'
  ];

  // Remote provinces with higher shipping fees
  const remoteProvinces = [
    'Tỉnh Cao Bằng',
    'Tỉnh Hà Giang',
    'Tỉnh Lai Châu',
    'Tỉnh Lào Cai',
    'Tỉnh Điện Biên',
    'Tỉnh Sơn La',
    'Tỉnh Yên Bái',
    'Tỉnh Tuyên Quang',
    'Tỉnh Bắc Kạn',
    'Tỉnh Thái Nguyên',
    'Tỉnh Lạng Sơn',
    'Tỉnh Quảng Ninh',
    'Tỉnh Bắc Giang',
    'Tỉnh Phú Thọ',
    'Tỉnh Vĩnh Phúc',
    'Tỉnh Bắc Ninh',
    'Tỉnh Hải Dương',
    'Tỉnh Hưng Yên',
    'Tỉnh Thái Bình',
    'Tỉnh Hà Nam',
    'Tỉnh Nam Định',
    'Tỉnh Ninh Bình'
  ];

  let multiplier = 1;
  
  if (majorCities.includes(province)) {
    multiplier = 0.8; // 20% discount for major cities
  } else if (remoteProvinces.includes(province)) {
    multiplier = 1.5; // 50% surcharge for remote provinces
  }

  return Math.round(baseFees[shippingMethod] * multiplier);
};

const ProvinceSelect = ({ formData, setFormData, errors, onShippingFeeChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);


  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0 && Array.isArray(data.data)) {
          setProvinces(data.data);
        } else {
          console.error("Dữ liệu tỉnh thành không hợp lệ");
        }
      })
      .catch((err) => console.error("Lỗi khi lấy tỉnh thành:", err));
  }, []);

  useEffect(() => {
    if (formData.provinceId) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${formData.provinceId}.htm`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error === 0 && Array.isArray(data.data)) {
            setDistricts(data.data);
          }else{
            console.error("Dữ liệu phường xã không hợp lệ");
          }
        })
        .catch((err) => console.error("Lỗi khi lấy quận/huyện:", err));
    } else {
      setDistricts([]);
    }
  }, [formData.provinceId]);


  useEffect(() => {
    if(formData.districtId) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${formData.districtId}.htm`)
        .then((response) => response.json())
        .then((data) => {
            if(data.error === 0 && Array.isArray(data.data)){
                setWards(data.data);
            }else{
                console.error("Dữ liệu phường/xã không hợp lệ");
            }
        })
        .catch((err) => console.error("Lỗi khi lấy phường/xã:", err));
      } else {
        setWards([]);
      }
    }, [formData.districtId]);

  return (
    <>
      {/* Tỉnh/Thành + Quận/Huyện */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tỉnh/Thành */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành Phố</label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.province ? "border-red-500" : "border-gray-300"
            } px-3 py-2`}
            value={formData.province}
            onChange={(e) =>{
              const selectedProvince = provinces.find(p => p.full_name === e.target.value);
              if (selectedProvince) {
                const newFormData = { 
                  ...formData, 
                  province: selectedProvince.full_name,
                  provinceId: selectedProvince.id, 
                  district: "", 
                  districtId: "",
                  ward: "" 
                };
                setFormData(newFormData);
                
                // Calculate and update shipping fee
                if (onShippingFeeChange) {
                  const shippingFee = calculateShippingFee(selectedProvince.full_name, formData.shippingMethod);
                  onShippingFeeChange(shippingFee);
                }
              } else {
                setFormData({ 
                  ...formData, 
                  province: e.target.value,
                  provinceId: "",
                  district: "", 
                  districtId: "",
                  ward: "" 
                });
              }
            }
            }
          >
            <option value="">Chọn Tỉnh/Thành</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.full_name}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1">{errors.province}</p>
          )}
        </div>

        {/* Quận/Huyện (hiện chưa load từ API) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.district ? "border-red-500" : "border-gray-300"
            } px-3 py-2`}
            value={formData.district}
            onChange={(e) => {
              const selectedDistrict = districts.find(d => d.full_name === e.target.value);
              if (selectedDistrict) {
                setFormData({ 
                  ...formData, 
                  district: selectedDistrict.full_name, 
                  districtId: selectedDistrict.id,
                  ward: ""
                });
              } else {
                setFormData({ 
                  ...formData, 
                  district: e.target.value, 
                  districtId: "",
                  ward: ""
                });
              }
            }}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) =>(
                <option key={district.id} value={district.full_name}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">{errors.district}</p>
          )}
        </div>
      </div>

      {/* Phường/Xã (hiện chưa load từ API) */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
        <select
          className={`mt-1 block w-full rounded-md border ${
            errors.ward ? "border-red-500" : "border-gray-300"
          } px-3 py-2`}
          value={formData.ward}
          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((wards) =>(
            <option key={wards.id} value={wards.full_name}>{wards.name}</option>
          ))}
        </select>
        {errors.ward && (
          <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
        )}
      </div>
    </>
  );
};

export default ProvinceSelect;
export { calculateShippingFee };