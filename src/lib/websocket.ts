type EventCallback = (event: any) => void;

class RealtimeWebSocketClient {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private pingInterval: any = null;
  private token: string | null = null;
  private isClosedManually: boolean = false;

  public connect(token: string) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.token = token;
    this.isConnecting = true;
    this.isClosedManually = false;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      // Send auth frame immediately within 5s window
      if (this.token) {
        this.send({ type: "auth", token: this.token });
      }

      // Start ping heartbeat every 25 seconds
      if (this.pingInterval) clearInterval(this.pingInterval);
      this.pingInterval = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.send({ type: "ping" });
        }
      }, 25000);
    };

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const eventType = payload.type;

        // Emit to wildcard listeners and specific type listeners
        const typeListeners = this.listeners.get(eventType);
        if (typeListeners) {
          typeListeners.forEach((cb) => cb(payload));
        }
        const wildcardListeners = this.listeners.get("*");
        if (wildcardListeners) {
          wildcardListeners.forEach((cb) => cb(payload));
        }
      } catch (err) {
        console.error("Error parsing WS frame:", err);
      }
    };

    this.socket.onclose = (e) => {
      this.cleanup();
      if (!this.isClosedManually && e.code !== 4401) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (err) => {
      console.error("WS error:", err);
    };
  }

  public disconnect() {
    this.isClosedManually = true;
    this.cleanup();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.isConnecting = false;
  }

  private scheduleReconnect() {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    setTimeout(() => {
      if (this.token && !this.isClosedManually) {
        this.connect(this.token);
      }
    }, delay);
  }

  public send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  public on(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }
}

export const wsClient = new RealtimeWebSocketClient();
