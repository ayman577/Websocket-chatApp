package webSocket

import (
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID         string          `json:"id"`
	Connection *websocket.Conn `json:"connection"`
	Chat       chan *Chat      `json:"chat"`
	RoomId     string          `json:"roomId"`
	Username   string          `json:"username"`
}

type Chat struct {
	Message  string `json:"message"`
	RoomID   string `json:"id"`
	Username string `json:"username"`
}

func (c *Client) WriteMessage() {
	defer func() {
		c.Connection.Close()
	}()

	for {
		message, ok := <-c.Chat
		if !ok {
			return
		}

		c.Connection.WriteJSON(message)
	}
}

func (c *Client) readMessage(n *Network) {
	defer func() {
		n.Unregister <- c
		c.Connection.Close()
	}()

	for {
		_, m, err := c.Connection.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		chat := &Chat{
			Message:  string(m),
			RoomID:   c.RoomId,
			Username: c.Username,
		}
		n.Broadcast <- chat
	}
}
