import React from 'react';
import PersonalSchedule from './PersonalSchedule';

const TestPersonalSchedule = () => {
  // Mock userId for testing
  const mockUserId = 2; // Replace with actual consultant ID

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Personal Schedule Component</h2>
      <PersonalSchedule userId={mockUserId} />
    </div>
  );
};

export default TestPersonalSchedule;
