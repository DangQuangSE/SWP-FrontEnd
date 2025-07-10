import React from "react";
import { ChatWebSocketProvider } from "./ChatWebSocketProvider";

/**
 * Safe WebSocket Provider Wrapper
 * Chỉ kích hoạt WebSocket cho chat functionality, không ảnh hưởng đến các chức năng khác
 */
const SafeChatWebSocketProvider = ({ children, enableChat = false }) => {
  // Chỉ sử dụng WebSocket khi enableChat = true
  if (!enableChat) {
    console.log(
      "🔇 [SAFE WEBSOCKET] Chat disabled, rendering without WebSocket"
    );
    return <>{children}</>;
  }

  console.log("🔌 [SAFE WEBSOCKET] Chat enabled, initializing WebSocket");

  // Wrap với error boundary để tránh crash
  try {
    return <ChatWebSocketProvider>{children}</ChatWebSocketProvider>;
  } catch (error) {
    console.error(" [SAFE WEBSOCKET] WebSocket provider error:", error);
    // Fallback: render children without WebSocket
    return <>{children}</>;
  }
};

export default SafeChatWebSocketProvider;
