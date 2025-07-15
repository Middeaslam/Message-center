import cors from 'cors';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data - Updated with proper sent messages
let messages = [
  // Inbox messages (existing)
  {
    id: uuidv4(),
    sender: 'Impact Team',
    subject: 'Weekly Sales Report Required',
    preview:
      'Please submit your weekly sales report by EOD Friday. Include inventory levels and any issues encountered.',
    content:
      'Dear Team,\n\nPlease submit your weekly sales report by EOD Friday. Include inventory levels and any issues encountered during the week. This report is crucial for our monthly review meeting.\n\nBest regards,\nImpact Team',
    priority: 'high',
    timestamp: '2025-01-22T10:30:00Z',
    isRead: false,
    hasAttachment: false,
    type: 'inbox'
  },
  {
    id: uuidv4(),
    sender: 'Impact Team',
    subject: 'New Product Launch Guidelines',
    preview:
      'New product launch scheduled for next week. Please review the attached guidelines and confirm receipt.',
    content:
      'Team,\n\nWe have a new product launch scheduled for next week. Please review the attached guidelines carefully and confirm receipt by replying to this message.\n\nThe launch timeline is tight, so immediate attention is required.\n\nThanks,\nImpact Team',
    priority: 'medium',
    timestamp: '2025-01-22T09:15:00Z',
    isRead: false,
    hasAttachment: true,
    type: 'inbox'
  },
  {
    id: uuidv4(),
    sender: 'Impact Team',
    subject: 'Store Compliance Audit',
    preview:
      'Compliance audit scheduled for January 25th. Ensure all documentation is ready for review.',
    content:
      'All Store Managers,\n\nA compliance audit has been scheduled for January 25th. Please ensure all documentation is ready for review, including:\n\n- Safety protocols\n- Employee training records\n- Inventory management logs\n- Customer service policies\n\nFailure to have documentation ready may result in compliance violations.\n\nRegards,\nCompliance Team',
    priority: 'high',
    timestamp: '2025-01-21T14:45:00Z',
    isRead: true,
    hasAttachment: false,
    type: 'inbox'
  },
  {
    id: uuidv4(),
    sender: 'HR Department',
    subject: 'Team Building Event',
    preview:
      'Join us for our quarterly team building event next Friday. RSVP required.',
    content:
      'Dear All,\n\nWe are excited to announce our quarterly team building event scheduled for next Friday at the community center.\n\nActivities include:\n- Team challenges\n- Lunch provided\n- Awards ceremony\n\nPlease RSVP by Wednesday so we can arrange catering accordingly.\n\nLooking forward to seeing everyone there!\n\nHR Team',
    priority: 'low',
    timestamp: '2025-01-20T16:20:00Z',
    isRead: true,
    hasAttachment: false,
    type: 'inbox'
  },
  {
    id: uuidv4(),
    sender: 'IT Support',
    subject: 'System Maintenance Window',
    preview:
      'Scheduled system maintenance this weekend. Expect brief service interruptions.',
    content:
      'Dear Users,\n\nWe have scheduled system maintenance for this weekend from 2 AM to 6 AM on Saturday.\n\nDuring this time, you may experience:\n- Brief service interruptions\n- Slower response times\n- Temporary unavailability of some features\n\nWe apologize for any inconvenience and appreciate your patience.\n\nIT Support Team',
    priority: 'medium',
    timestamp: '2025-01-19T11:30:00Z',
    isRead: false,
    hasAttachment: false,
    type: 'inbox'
  },

  // Sent messages - NEW
  {
    id: uuidv4(),
    sender: 'You',
    recipient: 'Impact Team',
    subject: 'Weekly Sales Report - January Week 3',
    preview:
      'Please find attached the weekly sales report for January week 3. All targets exceeded with 15% growth.',
    content:
      'Dear Impact Team,\n\nPlease find attached the comprehensive weekly sales report for January week 3.\n\nKey Highlights:\n- Total Sales: $52,400 (15% above target)\n- New Customers: 28\n- Customer Retention: 94%\n- Top Performing Products: Electronics, Home Goods\n- Regional Performance: All regions showing positive growth\n\nChallenges Addressed:\n- Inventory shortage in electronics resolved\n- Staff training completed for new product lines\n- Customer feedback system implemented\n\nNext Week Goals:\n- Maintain current sales momentum\n- Launch new marketing campaign\n- Complete Q1 planning sessions\n\nPlease let me know if you need any additional details or clarification.\n\nBest regards,\n[Your Name]',
    priority: 'high',
    timestamp: '2025-01-21T17:30:00Z',
    isRead: true,
    hasAttachment: true,
    type: 'sent'
  },
  {
    id: uuidv4(),
    sender: 'You',
    recipient: 'HR Department',
    subject: 'Team Building Event - RSVP Confirmation',
    preview:
      'Confirming my attendance for the quarterly team building event. Looking forward to it!',
    content:
      'Hi HR Team,\n\nI wanted to confirm my attendance for the upcoming quarterly team building event scheduled for next Friday.\n\nI am excited about the planned activities and the opportunity to bond with the team outside of our usual work environment.\n\nPlease let me know if there is anything specific I should bring or prepare for the event.\n\nThank you for organizing this!\n\nBest regards,\n[Your Name]',
    priority: 'low',
    timestamp: '2025-01-20T15:45:00Z',
    isRead: true,
    hasAttachment: false,
    type: 'sent'
  },
  {
    id: uuidv4(),
    sender: 'You',
    recipient: 'IT Support',
    subject: 'System Access Request',
    preview:
      'Requesting access to the new inventory management system for my team.',
    content:
      'Dear IT Support,\n\nI hope this email finds you well.\n\nI am writing to request access to the new inventory management system for myself and my team members. We will need the following access levels:\n\n- Read/Write access to inventory data\n- Report generation capabilities\n- User management for my team (5 members)\n\nTeam members requiring access:\n1. John Smith - Manager\n2. Sarah Johnson - Analyst\n3. Mike Davis - Coordinator\n4. Lisa Brown - Assistant\n5. Tom Wilson - Intern\n\nWe would appreciate it if this could be set up by the end of this week as we are planning to start using the system for our monthly inventory review.\n\nPlease let me know if you need any additional information or if there are any forms that need to be completed.\n\nThank you for your assistance.\n\nBest regards,\n[Your Name]',
    priority: 'medium',
    timestamp: '2025-01-19T09:20:00Z',
    isRead: true,
    hasAttachment: false,
    type: 'sent'
  },
  {
    id: uuidv4(),
    sender: 'You',
    recipient: 'Finance Department',
    subject: 'Budget Approval Request - Q1 Marketing',
    preview:
      'Submitting budget approval request for Q1 marketing initiatives. Total requested: $15,000.',
    content:
      'Dear Finance Team,\n\nI am submitting a budget approval request for our Q1 marketing initiatives.\n\nRequested Budget Breakdown:\n- Digital Marketing Campaigns: $8,000\n- Print Advertising: $3,000\n- Event Sponsorships: $2,500\n- Marketing Materials: $1,500\n\nTotal Requested: $15,000\n\nJustification:\nThese marketing initiatives are essential for:\n1. Increasing brand awareness in our target market\n2. Supporting the new product launch\n3. Driving customer acquisition and retention\n4. Competing effectively with market leaders\n\nExpected ROI: 300% based on previous campaign performance\n\nAttached you will find:\n- Detailed budget breakdown\n- Marketing strategy overview\n- Previous campaign performance data\n- Vendor quotes and proposals\n\nI would appreciate your review and approval at your earliest convenience so we can proceed with campaign planning.\n\nPlease let me know if you need any additional information.\n\nThank you,\n[Your Name]',
    priority: 'high',
    timestamp: '2025-01-18T14:15:00Z',
    isRead: true,
    hasAttachment: true,
    type: 'sent'
  }
];

// API Routes - Updated to handle message types
app.get('/api/messages', (req, res) => {
  const { filter = 'all', search = '', type = 'inbox' } = req.query;

  let filteredMessages = messages;

  // Filter by type (inbox or sent)
  filteredMessages = messages.filter((msg) => msg.type === type);

  // Apply read/unread filter (only for inbox)
  if (type === 'inbox' && filter !== 'all') {
    if (filter === 'unread') {
      filteredMessages = filteredMessages.filter((msg) => !msg.isRead);
    } else if (filter === 'read') {
      filteredMessages = filteredMessages.filter((msg) => msg.isRead);
    }
  }

  // Apply search
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredMessages = filteredMessages.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(searchTerm) ||
        msg.sender.toLowerCase().includes(searchTerm) ||
        msg.preview.toLowerCase().includes(searchTerm) ||
        (msg.recipient && msg.recipient.toLowerCase().includes(searchTerm))
    );
  }

  // Sort by timestamp (newest first)
  filteredMessages.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Calculate unread count (only for inbox messages)
  const inboxMessages = messages.filter((msg) => msg.type === 'inbox');
  const unreadCount = inboxMessages.filter((msg) => !msg.isRead).length;

  res.json({
    messages: filteredMessages,
    totalCount: messages.filter((msg) => msg.type === type).length,
    unreadCount: unreadCount
  });
});

// Keep your existing endpoints unchanged
app.get('/api/messages/:id', (req, res) => {
  const message = messages.find((msg) => msg.id === req.params.id);

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  res.json(message);
});

app.patch('/api/messages/:id/read', (req, res) => {
  const messageIndex = messages.findIndex((msg) => msg.id === req.params.id);

  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages[messageIndex].isRead = true;
  res.json(messages[messageIndex]);
});

app.patch('/api/messages/:id/unread', (req, res) => {
  const messageIndex = messages.findIndex((msg) => msg.id === req.params.id);

  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages[messageIndex].isRead = false;
  res.json(messages[messageIndex]);
});

app.post('/api/messages', (req, res) => {
  try {
    const { recipient, subject, content, priority = 'medium' } = req.body;

    // Validation
    const errors = [];
    
    if (!recipient || !recipient.trim()) {
      errors.push('Recipient is required');
    } else if (!/\S+@\S+\.\S+/.test(recipient.trim())) {
      errors.push('Please enter a valid email address');
    }
    
    if (!subject || !subject.trim()) {
      errors.push('Subject is required');
    }
    
    if (!content || !content.trim()) {
      errors.push('Message content is required');
    }
    
    if (!['high', 'medium', 'low'].includes(priority)) {
      errors.push('Invalid priority level');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    // Create the new message
    const newMessage = {
      id: uuidv4(),
      sender: 'You',
      recipient: recipient.trim(),
      subject: subject.trim(),
      preview: content.trim().substring(0, 100) + (content.trim().length > 100 ? '...' : ''),
      content: content.trim(),
      priority,
      timestamp: new Date().toISOString(),
      isRead: true,
      hasAttachment: false,
      type: 'sent'
    };

    // Add to messages array
    messages.unshift(newMessage);
    
    console.log(`New message created: ${newMessage.subject} to ${newMessage.recipient}`);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'Failed to create message' 
    });
  }
});

app.delete('/api/messages/:id', (req, res) => {
  const messageIndex = messages.findIndex((msg) => msg.id === req.params.id);

  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages.splice(messageIndex, 1);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Message Center API running on http://localhost:${PORT}`);
});
