import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '@/services/api';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL!;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinMemberRoom: (memberId: string) => void;
  leaveMemberRoom: (memberId: string) => void;
  onAttendanceUpdated: (callback: (data: any) => void) => void;
  onNoShowCase: (callback: (data: any) => void) => void;
  onFollowUpUpdated: (callback: (data: any) => void) => void;
  onPaymentVerified: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = connectSocket();
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    setSocket(newSocket);

    return () => {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const joinMemberRoom = (memberId: string) => {
    socket?.emit('join:member', memberId);
  };

  const leaveMemberRoom = (memberId: string) => {
    socket?.emit('leave:member', memberId);
  };

  const onAttendanceUpdated = (callback: (data: any) => void) => {
    socket?.on('attendance:updated', callback);
    return () => socket?.off('attendance:updated', callback);
  };

  const onNoShowCase = (callback: (data: any) => void) => {
    socket?.on('no-show:case', callback);
    return () => socket?.off('no-show:case', callback);
  };

  const onFollowUpUpdated = (callback: (data: any) => void) => {
    socket?.on('follow-up:updated', callback);
    return () => socket?.off('follow-up:updated', callback);
  };

  const onPaymentVerified = (callback: (data: any) => void) => {
    socket?.on('payment:verified', callback);
    return () => socket?.off('payment:verified', callback);
  };

  const value = {
    socket,
    isConnected,
    joinMemberRoom,
    leaveMemberRoom,
    onAttendanceUpdated,
    onNoShowCase,
    onFollowUpUpdated,
    onPaymentVerified,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
