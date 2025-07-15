import { Paperclip, Send, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { NewMessageData } from '../types';
import { sendMessage } from '../slices/messageSlice';
import styled from 'styled-components';
import { useAppDispatch } from '../store/hooks';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all ${({ theme }) => theme.transitions.default};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
    align-items: flex-start;
    padding-top: 20px;
  }
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${({ $isOpen }) => ($isOpen ? 'scale(1)' : 'scale(0.9)')};
  transition: transform ${({ theme }) => theme.transitions.default};
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
    max-height: 85vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition: border-color ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px; /* Prevent zoom on iOS */
    min-height: 100px;
  }
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const GeneralErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.status.error}15;
  border: 1px solid ${({ theme }) => theme.colors.status.error}40;
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  color: ${({ theme }) => theme.colors.status.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 2;
  }
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 1;
    width: 100%;
  }
`;

const AttachButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === 'primary' ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? theme.colors.background
      : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme, $variant }) =>
      $variant === 'primary'
        ? theme.colors.primaryHover
        : theme.colors.backgroundSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1;
    justify-content: center;
  }
`;

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  recipient: string;
  subject: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

interface FormErrors {
  recipient?: string;
  subject?: string;
  content?: string;
  general?: string;
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        recipient: '',
        subject: '',
        content: '',
        priority: 'medium'
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Recipient is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.recipient.trim())) {
      newErrors.recipient = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors

    try {
      const messageData: NewMessageData = {
        recipient: formData.recipient.trim(),
        subject: formData.subject.trim(),
        content: formData.content.trim(),
        priority: formData.priority
      };

      await dispatch(sendMessage(messageData)).unwrap();
      onClose();
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      // Handle backend validation errors
      if (error?.details && Array.isArray(error.details)) {
        setErrors({ general: error.details.join(', ') });
      } else if (error?.message) {
        setErrors({ general: error.message });
      } else if (typeof error === 'string') {
        setErrors({ general: error });
      } else {
        setErrors({ general: 'Failed to send message. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>New Message</ModalTitle>
          <CloseButton onClick={onClose} aria-label='Close modal'>
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {errors.general && (
              <GeneralErrorMessage>
                {errors.general}
              </GeneralErrorMessage>
            )}
            
            <FormField>
              <Label htmlFor='recipient'>To *</Label>
              <Input
                id='recipient'
                name='recipient'
                type='email'
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder='Enter recipient email address'
                autoComplete='email'
              />
              {errors.recipient && (
                <ErrorMessage>{errors.recipient}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label htmlFor='subject'>Subject *</Label>
              <Input
                id='subject'
                name='subject'
                type='text'
                value={formData.subject}
                onChange={handleInputChange}
                placeholder='Enter message subject'
                autoComplete='off'
              />
              {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
            </FormField>

            <FormField>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                id='priority'
                name='priority'
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value='low'>Low Priority</option>
                <option value='medium'>Medium Priority</option>
                <option value='high'>High Priority</option>
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor='content'>Message *</Label>
              <TextArea
                id='content'
                name='content'
                value={formData.content}
                onChange={handleInputChange}
                placeholder='Type your message here...'
              />
              {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
            </FormField>
          </Form>
        </ModalBody>

        <ModalFooter>
          <FooterLeft>
            <AttachButton type='button'>
              <Paperclip size={16} />
              Attach Files
            </AttachButton>
          </FooterLeft>

          <FooterRight>
            <ActionButton
              type='button'
              $variant='secondary'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type='submit'
              $variant='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </ActionButton>
          </FooterRight>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};