import React, { useEffect, useState } from 'react';
import { List, Button, Input, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Duty {
    id: string;
    name: string;
}

const Duties: React.FC = () => {
    const [duties, setDuties] = useState<Duty[]>([]);
    const [newDuty, setNewDuty] = useState('');

    useEffect(() => {
        fetchDuties();
    }, []);

    const fetchDuties = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/duties');
            setDuties(response.data);
        } catch (error) {
            message.error('Failed to fetch duties');
        }
    };

    const addDuty = async () => {
        if (!newDuty.trim()) {
            message.warning('Duty name cannot be empty');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/duties', { name: newDuty });
            setDuties([...duties, response.data]);
            setNewDuty('');
        } catch (error) {
            message.error('Failed to add duty');
        }
    };

    const deleteDuty = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/duties/${id}`);
            setDuties(duties.filter((duty) => duty.id !== id));
            message.success('Duty deleted successfully');
        } catch (error) {
            message.error('Failed to delete duty');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h2>To-Do List</h2>
            <Input
                placeholder="Enter duty name"
                value={newDuty}
                onChange={(e) => setNewDuty(e.target.value)}
                onPressEnter={addDuty}
            />
            <Button type="primary" onClick={addDuty} style={{ marginTop: 10 }}>
                Add Duty
            </Button>
            <List
                bordered
                dataSource={duties}
                renderItem={(duty) => (
                    <List.Item
                        key={duty.id}
                        actions={[
                            <Button
                                type="dashed"
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => deleteDuty(duty.id)}
                            />,
                        ]}
                    >
                        {duty.name}
                    </List.Item>
                )}
                style={{ marginTop: 20 }}
            />
        </div>
    );
};

export default Duties;