// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';

// const CustomDropdownEditor = (props) => {
//     const [selectedValue, setSelectedValue] = useState(
//         props.value ? { value: props.value, label: props.value } : null
//     );
//     const [options, setOptions] = useState([]);

//     useEffect(() => {
//         // Chuyển đổi danh sách `values` thành format `{ value, label }` cho react-select
//         const formattedOptions = props.values.map((val) => ({ value: val, label: val }));
//         setOptions(formattedOptions);
//     }, [props.values]);

//     const handleChange = (selectedOption) => {
//         setSelectedValue(selectedOption);
//         // Cập nhật giá trị cho grid
//         props.onValueChange(selectedOption ? selectedOption.value : null);
//     };

//     return (
//         <Select
//             options={options}
//             value={selectedValue}
//             onChange={handleChange}
//             isClearable={true} // Cho phép xóa lựa chọn
//             placeholder="Chọn vị trí..."
//             menuPlacement="auto" // Tự động điều chỉnh vị trí dropdown
//             filterOption={(candidate, input) =>
//                 candidate.label.toLowerCase().includes(input.toLowerCase())
//             } // Tìm kiếm nâng cao "like"
//         />
//     );
// };

// export default CustomDropdownEditor;


import React, { useState } from 'react';

const CustomDropdownEditor = (props) => {
    const [value, setValue] = useState(props.value || '');

    const handleChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        props.stopEditing(); // Dừng chỉnh sửa sau khi chọn
        props.setValue(newValue); // Gửi giá trị lên ag-Grid
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            props.stopEditing(); // Dừng chỉnh sửa khi nhấn Enter
        }
    };

    return (
        <select
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ width: '100%' }}
        >
            <option value="">-- Chọn giá trị --</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
        </select>
    );
};

export default CustomDropdownEditor;




