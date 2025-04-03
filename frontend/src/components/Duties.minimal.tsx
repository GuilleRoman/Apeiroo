// DutiesMinimal.tsx (with API Call - Corrected Validation)
import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import axios from 'axios';

const DutiesMinimal: React.FC = () => {
    const [newDuty, setNewDuty] = useState('');
    const [formErrors, setFormErrors] = useState<{ name?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateDutyName = (name: string): string | undefined => {
        if (!name) {
            return undefined; // Do not display error when input is empty on initial render
        }
        if (!name.trim()) {
            return 'Duty name cannot be empty';
        }
        if (name.length < 3) {
            return 'Duty name must be at least 3 characters';
        }
        if (name.length > 100) {
            return 'Duty name cannot exceed 100 characters';
        }
        return undefined;
    };

    const addDuty = async () => {
        console.log("Add duty function triggered (Minimal with API Call)");
        const nameError = validateDutyName(newDuty);
        if (nameError) {
            setFormErrors({ name: nameError });
            return;
        }
        setFormErrors({});
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:3001/api/duties', { name: newDuty });
            message.success('Duty added successfully');
        } catch (error) {
            message.error('Failed to add duty');
        } finally {
            setIsSubmitting(false);
        }
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

    return (
        <Form>
            <Form.Item validateStatus={formErrors.name ? 'error' : ''} help={formErrors.name}>
                <Input
                    placeholder="Enter duty name"
                    value={newDuty}
                    onChange={handleInputChange}
                />
            </Form.Item>
            <Button type="primary" onClick={addDuty} loading={isSubmitting} disabled={!!formErrors.name || isSubmitting}>
                Add Duty
            </Button>
        </Form>
    );
};

export default DutiesMinimal;