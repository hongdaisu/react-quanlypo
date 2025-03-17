import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Grid.css';
import './GroupRole.scss'
import { fetchAllGroup } from '../../services/grouproleService';
import Group from './Group';
import Role from './Role';

const GroupRole = () => {
    return (
        <>
            <div className="users-container">
                <div className='container container-top'>
                    <div className='row'>
                        <div className='col-6'>
                            <Group />
                        </div>
                        <div className='col-6'>
                            <Role />
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default GroupRole;