import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, TableColumnType, Modal, Checkbox, Space, Tooltip } from 'antd';
import { DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, CaretUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Duty {
    id: string;
    name: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

const Duties: React.FC = () => {
    const [duties, setDuties] = useState<Duty[]>([]);
    const [newDuty, setNewDuty] = useState('');
    const [editingDuty, setEditingDuty] = useState<Duty | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedCompleted, setEditedCompleted] = useState(false);


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

    const updateDuty = async (id: string, name: string, completed: boolean) => {
      try {
          await axios.put(`http://localhost:3001/api/duties/${id}`, { name, completed });
          message.success('Duty updated successfully');
          await fetchDuties(); // Refetch duties after successful update
      } catch (error) {
          message.error('Failed to update duty');
      }
  };

  const showEditModal = (duty: Duty) => {
    setEditingDuty(duty);
    setEditedName(duty.name);
    setEditedCompleted(duty.completed);
};

const handleSave = async () => {
  if (editingDuty) {
      await updateDuty(editingDuty.id, editedName, editedCompleted); // Await the updateDuty function
      setEditingDuty(null);
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
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: "20%",
            render: (duty: Duty) => (
              <>
              <Space>
              <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => showEditModal(duty)}
              />
              <Button
                  type="dashed"
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => Modal.confirm({
                      title: 'Are you sure?',
                      onOk: () => deleteDuty(duty.id),
                  })}
              />
              </Space>
          </>
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
                expandable={{
                  expandedRowRender: (record: Duty) => (
                      <p style={{ margin: 0 }}>
                          Created At: {record.created_at} <br />
                          Updated At: {record.updated_at}
                      </p>
                  ),
                  rowExpandable: (record) => true,
                  expandIcon: ({ expanded, record, onExpand }) => (
                      <Tooltip title="Show/Hide Details">
                          <span
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                  onExpand(record, e);
                              }}
                          >
                              {expanded ? <CaretUpOutlined /> : <InfoCircleOutlined />}
                          </span>
                      </Tooltip>
                  ),
              }}
            />
            <Modal
                title="Edit Duty"
                visible={!!editingDuty}
                onOk={handleSave}
                onCancel={() => setEditingDuty(null)}
            >
                <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Checkbox
                    checked={editedCompleted}
                    onChange={(e) => setEditedCompleted(e.target.checked)}
                >
                    Completed
                </Checkbox>
            </Modal>
        </div>
    );

    
};

export default Duties;