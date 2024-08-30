"use client";
import react, {useState, createContext} from 'react'

type Connection= WebSocket | null

export const WebSocketContext = createContext<{
    connection: Connection,
    setConnection: (cnx: Connection) => void
}>({
    connection: null,
    setConnection: () => {}
})

const WebSocketProvider = ({children}: {children: React.ReactNode}) => {
    const[connection, setConnection] = useState<Connection>(null)

    return(
        <WebSocketContext.Provider
        value ={{
            connection: connection,
            setConnection: setConnection,
        }}
        >
            {children}
        </WebSocketContext.Provider> 
    )
}

export default WebSocketProvider