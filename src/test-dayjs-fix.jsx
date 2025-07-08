import React from "react";
import { Button, Card, Space, Typography } from "antd";
import { MedicalResultButton } from "./components/MedicalResult";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/**
 * Test component to verify dayjs error fix
 */
const TestDayjsFix = () => {
  // Mock appointment detail for testing
  const testAppointmentDetail = {
    id: 123,
    serviceName: "HIV Ag/Ab Combo Test",
    customerName: "Nguyễn Văn Test",
    consultantId: 2,
    consultantName: "BS. Test Doctor",
    slotTime: dayjs().toISOString(),
    status: "WAITING_RESULT",
  };

  const handleSuccess = (result) => {
    console.log(" Test successful! Result:", result);

    // Show formatted result
    const resultMessage = `
Form submitted successfully!

Request format matches backend ResultRequest:
- appointmentDetailId: ${result.appointmentDetailId}
- resultType: ${result.resultType}
- description: ${result.description?.substring(0, 50)}...
- diagnosis: ${result.diagnosis?.substring(0, 50)}...
- treatmentPlan: ${result.treatmentPlan?.substring(0, 50)}...
- testName: ${result.testName}
- testResult: ${result.testResult}
- testStatus: ${result.testStatus}
- sampleCollectedAt: ${result.sampleCollectedAt}

Check console for full details.
    `;

    alert(resultMessage);
  };

  const handleError = (error) => {
    console.error(" Test failed:", error);
    alert("Form submission failed! Check console for error details.");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={2}>🧪 Dayjs Error Fix Test</Title>

          <Text>
            Click the button below to test the medical result form. If no
            "date4.isValid is not a function" error appears in console, the fix
            is working!
          </Text>

          <div style={{ textAlign: "center" }}>
            <MedicalResultButton
              appointmentDetail={testAppointmentDetail}
              onSuccess={handleSuccess}
              onError={handleError}
              size="large"
              type="primary"
            >
              🧪 Test Medical Result Form
            </MedicalResultButton>
          </div>

          <div
            style={{
              background: "#f5f5f5",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Title level={4}>Test Instructions:</Title>
            <ol>
              <li>Click the "Test Medical Result Form" button</li>
              <li>The form should open without any console errors</li>
              <li>Try changing the date/time field</li>
              <li>Fill in some test data and submit</li>
              <li>Check console for any errors</li>
            </ol>
          </div>

          <div
            style={{
              background: "#e6f7ff",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Title level={4}>Expected Behavior:</Title>
            <ul>
              <li> No "date4.isValid is not a function" errors</li>
              <li> DatePicker works smoothly</li>
              <li> Form submission succeeds</li>
              <li> Console shows clean logs</li>
              <li> Safe dayjs wrapper prevents validation errors</li>
              <li> Custom validator handles all date formats</li>
            </ul>
          </div>

          <div
            style={{
              background: "#fff2e8",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Title level={4}>🔧 Applied Fixes:</Title>
            <ul>
              <li>🛡️ Safe dayjs wrapper with isValid override</li>
              <li> Comprehensive date validation in form submission</li>
              <li>📅 Enhanced DatePicker onChange with multiple fallbacks</li>
              <li>Custom Form.Item validator to prevent validation errors</li>
              <li>🚫 Try-catch blocks around all dayjs operations</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TestDayjsFix;
