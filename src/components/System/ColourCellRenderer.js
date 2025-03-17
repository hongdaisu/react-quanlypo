import React from 'react';

const ColourCellRenderer = (props) => {
    //console.log('ColourCellRenderer', props)
    return (
        props.value != null && (
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <span
                    style={{
                        borderLeft: '10px solid ' + props.value,
                        paddingRight: '5px',
                    }}
                />
                {props.value}
            </div>
        )
    );
};

export default ColourCellRenderer;
