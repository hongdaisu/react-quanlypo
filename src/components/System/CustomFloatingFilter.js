// // ClearableFloatingFilter.js
// import React, { useEffect, useState } from 'react';
// const ClearableFloatingFilter = (props) => {
//     const [value, setValue] = useState('');

//     useEffect(() => {
//         props.parentFilterInstance((instance) => {
//             instance.onFloatingFilterChanged('contains', value);
//         });
//     }, [value]);

//     const onInputChange = (event) => {
//         setValue(event.target.value);
//         props.parentFilterInstance((instance) => {
//             instance.onFloatingFilterChanged('contains', event.target.value);
//         });
//     };

//     const clearFilter = () => {
//         setValue('');
//         props.parentFilterInstance((instance) => {
//             instance.onFloatingFilterChanged('contains', '');
//         });
//     };
//     //style={{ display: 'flex', alignItems: 'center', width: '100%' }}
//     return (
//         <div className='input-search'>
//             <input
//                 type="text"
//                 value={value}
//                 onChange={onInputChange}
//                 style={{ flex: 1, maxWidth: '100%', boxSizing: 'border-box' }}
//                 placeholder=""
//             />
//             <span className="search-icon"><i className="fa fa-search"></i></span>
//             {value && (
//                 <button className='btn-xoa-search'
//                     onClick={clearFilter}
//                 >
//                     <i className="fa fa-times"></i>
//                 </button>
//             )}
//         </div>
//     );
// };

// export default ClearableFloatingFilter;


import React, { useEffect, useState } from 'react';

const ClearableFloatingFilter = (props) => {
    const [value, setValue] = useState('');
    const [isInputEmpty, setIsInputEmpty] = useState(true);

    useEffect(() => {
        props.parentFilterInstance((instance) => {
            instance.onFloatingFilterChanged('contains', value);
        });
    }, [value]);

    const onInputChange = (event) => {
        const inputValue = event.target.value;
        setValue(inputValue);
        props.parentFilterInstance((instance) => {
            instance.onFloatingFilterChanged('contains', inputValue);
        });
        setIsInputEmpty(inputValue === '');
    };

    const clearFilter = () => {
        setValue('');
        props.parentFilterInstance((instance) => {
            instance.onFloatingFilterChanged('contains', '');
        });
        setIsInputEmpty(true);
    };

    return (
        <div className='input-search'>
            <input
                type="text"
                value={value}
                onChange={onInputChange}
                style={{
                    flex: 1,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    borderColor: 'rgba(231, 235, 236, 0.901)',
                    // borderStyle: 'solid',
                    borderWidth: '1px'
                }}
                placeholder=""
            />
            {isInputEmpty && (
                <span className="search-icon"><i className="fa fa-search"></i></span>
            )}
            {value && (
                <button className='btn-xoa-search' onClick={clearFilter}>
                    <i className="fa fa-times"></i>
                </button>
            )}
        </div>
    );
};

export default ClearableFloatingFilter;
