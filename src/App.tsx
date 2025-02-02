/**
 * Importing necessary modules and components from respective libraries
 */
import React, {useEffect, useState} from "react";
import {functions} from "./firebase-config";
import {httpsCallable} from "firebase/functions";
import 'firebase/functions';
import {getDatabase, onValue, ref} from "firebase/database";
import {Button, Flex} from 'antd';
import NotificationsTable, {NotificationDataType} from "./components/NotificationsTable";

/**
 * Type definition for the loading state of notifications
 */
type LoadingState = {
  notification1: boolean;
  notification2: boolean;
  notification3: boolean;
};

/**
 * Interface for the format of a notification
 */
interface NotificationFormat {
  content: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Interface for the notifications object
 */
interface Notifications {
  [key: string]: NotificationFormat;
}

/**
 * Main App component
 */
const App: React.FC = () => {
  /**
   * State variables for notifications and loading state
   */
  const [notifications, setNotifications] = useState<NotificationDataType[]>([]);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    notification1: false,
    notification2: false,
    notification3: false
  });

  /**
   * useEffect hook to fetch notifications from Firebase
   */
  useEffect(() => {

    const database = getDatabase()
    const query = ref(database, 'notifications');

    /**
     * Listening for changes in the 'notifications' reference
     */
    onValue(query, (snapshot) => {
      const data = snapshot.val() || {};
      const transformedData = transformData(data);

      if(snapshot.exists()){
        setNotifications(transformedData)
      }
    }, {onlyOnce: false});
  }, []);

  /**
   * Function to handle button click and publish notification
   */
  const handleButtonClick = async (message: string, notification: keyof LoadingState) => {
    try {
      setIsLoading(prevState => ({...prevState, [notification]: true}));
      const publishNotification= httpsCallable(functions, 'publishNotification');
      await publishNotification({ message });
    } catch (e) {
      console.log('Publish notification failed!', e)
    } finally {
      setIsLoading(prevState => ({...prevState, [notification]: false}));
    }
  };

  /**
   * Function to transform the notifications data
   */
  const transformData = (notifications: Notifications): NotificationDataType[] => {
    return Object.keys(notifications).map((notification) => ({
      key: notification,
      content: notifications[notification].content,
      isRead: notifications[notification].isRead,
      createdAt: String(notifications[notification].createdAt)
    }));
  }

  /**
   * Rendering the App component
   */
  return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <h1>Notification System</h1>
          <Flex gap="middle" vertical={false} justify='center' align='center'>
            <Button type="default" iconPosition="end" loading={isLoading.notification1} disabled={isLoading.notification1} onClick={() => handleButtonClick("Notification 1", "notification1")}>Send Notification 1</Button>
            <Button type="primary" iconPosition="end" loading={isLoading.notification2} disabled={isLoading.notification2} onClick={() => handleButtonClick("Notification 2", "notification2")}>Send Notification 2</Button>
            <Button type="default" iconPosition="end" loading={isLoading.notification3} disabled={isLoading.notification3} onClick={() => handleButtonClick("Notification 3", "notification3")}>Send Notification 3</Button>
          </Flex>
          <NotificationsTable data={notifications} />
        </div>
      </div>
  );
};

/**
 * Exporting the App component
 */
export default App;