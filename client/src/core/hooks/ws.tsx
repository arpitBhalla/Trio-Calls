import React from "react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { ServerURL } from "core/const";

const socket = io(ServerURL);

export const SocketContext =
  React.createContext<Socket<DefaultEventsMap, DefaultEventsMap>>(socket);

export const SocketProvider: React.FC = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
  const socketConsumerContext = React.useContext(SocketContext);
  return socketConsumerContext;
};
