import { Dropdown, Space, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { Excel } from 'antd-table-saveas-excel'
import {
    DownOutlined,
} from '@ant-design/icons';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], handleDeleteMany } = props;
    const [rowSelectedKey, setRowSelectedKey] = useState([])
    const newColumnExport = useMemo(() => {
        const arr = columns.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKey(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };

    const handleDropdownItemClick = (e) => {
        if (e.key === '1') {
            handleDeleteMany(rowSelectedKey)
        } else if (e.key === '2') {
            exportExcel()
        }
    }

    const items = [
        {
            key: '2',
            label: (
                <p>Export to excel</p>
            ),
        },
        {
            key: '1',
            danger: true,
            label: (
                <p>Delete items selected</p>
            ),
        },
    ];

    const exportExcel = () => {
        const excel = new Excel()
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(data, {
                str2Percent: true
            })
            .saveAs("excel.xlsx")
    }

    return (
        <div>
            <Loading isLoading={isLoading}>
                {rowSelectedKey.length > 0 && (
                    <Dropdown
                        menu={{
                            onClick: handleDropdownItemClick,
                            items: items,
                        }}
                    >
                        <div style={{ width: '200px', color: 'blue', marginBottom: '10px' }} onClick={(e) => e.preventDefault()}>
                            <Space>
                                Action for select
                                <DownOutlined />
                            </Space>
                        </div>
                    </Dropdown>
                )}

                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    {...props}
                />
            </Loading>
        </div>
    );
}

export default TableComponent;
