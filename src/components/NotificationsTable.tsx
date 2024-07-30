/**
 * Importing necessary modules and components from respective libraries
 */
// @ts-ignore
import React from "react";
import {Button, Table, TableColumnsType} from "antd";
import {httpsCallable} from "firebase/functions";
import 'firebase/functions';
import {functions} from "../firebase-config";

/**
 * Interface for the format of a notification data type
 */
export interface NotificationDataType {
    key: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

/**
 * NotificationsTable component
 * @param {Object} props - The properties passed to the component
 * @param {NotificationDataType[]} props.data - The array of notifications data
 */
// @ts-ignore
const NotificationsTable: React.FC<{ data: NotificationDataType[] }> = (props) => {

    /**
     * Function to handle viewing of a notification
     * @param {NotificationDataType} record - The notification record to be viewed
     */
    const handleViewNotification = async (record: NotificationDataType) => {
        const updateNotification= httpsCallable(functions, 'updateNotification');
        await updateNotification({ id: record.key });
    };

    /**
     * Columns for the notifications table
     */
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

    /**
     * Rendering the NotificationsTable component
     */
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

/**
 * Exporting the NotificationsTable component
 */
export default NotificationsTable;