import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, TableColumnType } from 'antd';
import { DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Duty {
    id: string;
    name: string;
    completed: boolean;
    created_at: string;
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

    const columns: TableColumnType<Duty>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: '40%',
        },
        {
            title: 'Completed',
            dataIndex: 'completed',
            key: 'completed',
            align: 'center',
            render: (completed: boolean) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {completed ? (
                        <CheckCircleOutlined style={{ color: 'green', fontSize: '20px' }} />
                    ) : (
                        <CloseCircleOutlined style={{ color: 'red', fontSize: '20px' }} />
                    )}
                </div>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (duty: Duty) => (
                <Button
                    type="dashed"
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => deleteDuty(duty.id)}
                />
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
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
            <Table
                dataSource={duties}
                columns={columns}
                rowKey="id"
                style={{ marginTop: 20 }}
            />
        </div>
    );

    
};

export default Duties;