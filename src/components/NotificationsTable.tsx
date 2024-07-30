// @ts-ignore
import React from "react";
import {Button, Table, TableColumnsType} from "antd";
import {httpsCallable} from "firebase/functions";
import 'firebase/functions';
import {functions} from "../firebase-config";

export interface NotificationDataType {
    key: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

// @ts-ignore
const NotificationsTable: React.FC<{ data: NotificationDataType[] }> = (props) => {

    const handleViewNotification = async (record: NotificationDataType) => {
        const updateNotification= httpsCallable(functions, 'updateNotification');
        await updateNotification({ id: record.key });
    };
    
    const columns: TableColumnsType = [
        {
            title: 'Content',
            dataIndex: 'content',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record: any) => (
                <Button size="middle" type="default" disabled={record?.isRead} onClick={() => handleViewNotification(record)}>
                    { record?.isRead ? "Read" : 'Mark as Read' }
                </Button>
            ),
        }
    ];

    return (
        <div style={{ width: '800px', margin: '50px auto' }}>
            <h2 style={{ textAlign: 'start' }}>Notifications Listing</h2>
            <Table
                pagination={{ pageSize: 5000, hideOnSinglePage: true }}
                dataSource={props.data}
                columns={columns}
            />
        </div>
    );
}

export default NotificationsTable;