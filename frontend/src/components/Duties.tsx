import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  message,
  TableColumnType,
  Modal,
  Checkbox,
  Space,
  Tooltip,
  Form,
  ConfigProvider,
  Switch,
  theme,
} from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  CaretUpOutlined,
  InfoCircleOutlined,
  BulbFilled,
  BulbOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { act } from "@testing-library/react";

interface Duty {
  id: string;
  name: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface FormErrors {
  name?: string;
}

const Duties: React.FC = () => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [newDuty, setNewDuty] = useState("");
  const [editingDuty, setEditingDuty] = useState<Duty | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedCompleted, setEditedCompleted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#141414" : "#f5f5f5";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    fetchDuties();
  }, []);

  const fetchDuties = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/duties");
      act(() => {
        setDuties(response.data);
      });
    } catch (error) {
      message.error("Failed to fetch duties");
    }
  };

  const validateDutyName = (name: string): string | undefined => {
    if (!name) {
      return undefined; // Do not display error when input is empty on initial render
    }
    if (!name.trim()) {
      return "Duty name cannot be empty";
    }
    if (name.length < 3) {
      return "Duty name must be at least 3 characters";
    }
    if (name.length > 100) {
      return "Duty name cannot exceed 100 characters";
    }
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if (specialCharRegex.test(name)) {
      return "Duty name cannot contain special characters";
    }
    return undefined;
  };

  const addDuty = async () => {
    const nameError = validateDutyName(newDuty);
    if (nameError) {
      setFormErrors({ name: nameError });
      message.warning(nameError);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3001/api/duties", {
        name: newDuty,
      });
      setDuties([...duties, response.data]);
      setNewDuty("");
      message.success("Duty added successfully");
    } catch (error) {
      message.error("Failed to add duty");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDuty = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/duties/${id}`);
      setDuties(duties.filter((duty) => duty.id !== id));
      message.success("Duty deleted successfully");
    } catch (error) {
      message.error("Failed to delete duty");
    }
  };

  const updateDuty = async (id: string, name: string, completed: boolean) => {
    const nameError = validateDutyName(name);
    if (nameError) {
      setEditFormErrors({ name: nameError });
      message.warning(nameError);
      return false;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/duties/${id}`,
        { name, completed }
      );
      message.success("Duty updated successfully");

      setDuties(
        duties.map((duty) => {
          if (duty.id === id) {
            return { ...duty, name, completed, updated_at: response.data.updated_at };
          }
          return duty;
        })
      );
      return true;
    } catch (error) {
      console.error("Error updating duty (from React):", error);
      message.error("Failed to update duty");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (editingDuty) {
      // Check for validation errors before calling updateDuty
      if (Object.keys(editFormErrors).length === 0) {
        const success = await updateDuty(
          editingDuty.id,
          editedName,
          editedCompleted
        );
        if (success) {
          setEditingDuty(null);
        }
      }
    }
  };

  const showEditModal = (duty: Duty) => {
    setEditingDuty(duty);
    setEditedName(duty.name);
    setEditedCompleted(duty.completed);
    setEditFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewDuty(value);
    const nameError = validateDutyName(value);
    if (nameError) {
      setFormErrors({ name: nameError });
    } else {
      setFormErrors({});
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedName(value);
    const nameError = validateDutyName(value);
    if (nameError) {
      setEditFormErrors({ name: nameError });
    } else {
      setEditFormErrors({});
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const columns: TableColumnType<Duty>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record) => (
        <div>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      align: "center",
      render: (completed) =>
        completed ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            aria-label={`Edit ${record.name}`}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Are you sure?",
                onOk: () => deleteDuty(record.id),
              })
            }
            aria-label={`Delete ${record.name}`}
          />
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "auto",
          padding: 20,
          backgroundColor: isDarkMode ? "#141414" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
          minHeight: "100vh",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, color: isDarkMode ? "#fff" : "#000" }}>
            To-Do List
          </h2>
          <Space>
            {isDarkMode ? <BulbOutlined /> : <BulbFilled />}
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </Space>
        </div>

        <Form>
          <Form.Item
            validateStatus={formErrors.name ? "error" : ""}
            help={formErrors.name}
          >
            <Input
              placeholder="Enter duty name"
              value={newDuty}
              onChange={handleInputChange}
              onPressEnter={addDuty}
              status={formErrors.name ? "error" : ""}
              disabled={isSubmitting}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={addDuty}
            style={{ marginTop: 10 }}
            loading={isSubmitting}
            disabled={!!formErrors.name || isSubmitting || !newDuty.trim()}
          >
            Add Duty
          </Button>
        </Form>

        <Table
          dataSource={duties}
          columns={columns}
          rowKey="id"
          style={{ marginTop: 20 }}
          loading={isSubmitting}
          expandable={{
            expandedRowRender: (record: Duty) => (
              <p style={{ margin: 0 }}>
                Created At: {record.created_at} <br /> Updated At:
                {record.updated_at}
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
                    aria-label={`expand-details-${record.id}`} // Add aria-label
                >
                    {expanded ? <CaretUpOutlined /> : <InfoCircleOutlined />}
                </span>
            </Tooltip>
            ),
          }}
        />

        <Modal
          title="Edit Duty"
          open={!!editingDuty}
          onOk={handleSave}
          onCancel={() => setEditingDuty(null)}
          confirmLoading={isSubmitting}
        >
          <Form>
            <Form.Item
              validateStatus={editFormErrors.name ? "error" : ""}
              help={editFormErrors.name}
            >
              <Input
                value={editedName}
                onChange={handleEditInputChange}
                style={{ marginBottom: 10 }}
                status={editFormErrors.name ? "error" : ""}
                disabled={isSubmitting}
              />
            </Form.Item>
            <Checkbox
              checked={editedCompleted}
              onChange={(e) => setEditedCompleted(e.target.checked)}
              disabled={isSubmitting}
            >
              Completed
            </Checkbox>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Duties;
