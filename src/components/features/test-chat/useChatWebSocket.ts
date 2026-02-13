
import { useState, useEffect, useRef, useCallback } from 'react';

const WEBSOCKET_URL = 'wss://bagas-1701.tail23be80.ts.net';
const AUTH_PASSWORD = 'Binatanglaut123.';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseChatWebSocketReturn {
  messages: Message[];
  status: ConnectionStatus;
  sendMessage: (text: string) => void;
  reconnect: () => void;
  isLoading: boolean;
}

export const useChatWebSocket = (): UseChatWebSocketReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionKeyRef = useRef<string>('');

  // Generate session key on mount
  useEffect(() => {
    sessionKeyRef.current = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) return;

    setStatus('connecting');
    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      const authPayload = {
        type: 'req',
        id: `auth-${Date.now()}`,
        method: 'connect',
        params: {
          auth: { password: AUTH_PASSWORD },
          client: { 
            id: 'openclaw-control-ui', 
            platform: 'web',
            mode: 'webchat',
            version: 'dev'
          },
          minProtocol: 3,
          maxProtocol: 3
        }
      };
      
      console.log('Sending Auth Payload:', JSON.stringify(authPayload));
      ws.send(JSON.stringify(authPayload));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket Message:', data);
        
        // Handle 'event' based message structures (confirmed by logs)
        // Handle 'event' based message structures
        if (data.type === 'event' && (data.event === 'chat' || data.event === 'agent' || data.event === 'chat.message')) {
          let payload = data.payload;
          
          // Parse payload if it's a stringified JSON
          if (typeof payload === 'string') {
            try {
              payload = JSON.parse(payload);
            } catch (e) {
              // keep as string if not json
            }
          }

          // FILTERING LOGIC:
          // 1. Ignore lifecycle events (start, processing, etc.)
          if (payload?.stream === 'lifecycle') return;
          
          // 2. Ignore intermediate delta updates (to avoid duplicates/flickering)
          //    We only want the final text or the main 'assistant' stream block
          if (payload?.state === 'delta') return;

          let content = '';

          // 3. Extract text from 'assistant' stream
          if (payload?.stream === 'assistant' && payload?.data?.text) {
             content = payload.data.text;
          } else if (typeof payload?.text === 'string') {
             content = payload.text;
          } else if (typeof payload?.message === 'string') {
             content = payload.message;
          }
          
          // Only update state if we found actual text content
          if (content) {
            const newMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: content,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newMessage]);
            setIsLoading(false);
          }
        } else if (data.method === 'chat.message') {
           // Fallback for original spec
           const content = data.params?.text || JSON.stringify(data.params);
           const newMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: content,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setIsLoading(false);
        }

        // Handle error responses for sent messages
        if (data.type === 'res' && data.id?.startsWith('msg-') && !data.ok) {
          console.error('Chat Send Error:', data.error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `**Error:** ${data.error?.message || JSON.stringify(data.error)}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket Closed:', event.code, event.reason);
      setStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
      setIsLoading(false);
    };

  }, []);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    const messagePayload = {
      type: 'req',
      id: `msg-${Date.now()}`,
      method: 'chat.send',
      params: {
        message: text.trim(),
        sessionKey: sessionKeyRef.current,
        idempotencyKey: `idemp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    };
    
    console.log('Sending Message Payload:', JSON.stringify(messagePayload));
    wsRef.current.send(JSON.stringify(messagePayload));
  }, []);

  const reconnect = useCallback(() => {
    wsRef.current?.close();
    connect();
  }, [connect]);

  return {
    messages,
    status,
    sendMessage,
    reconnect,
    isLoading
  };
};
