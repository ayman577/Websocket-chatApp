package webSocket

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Network struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Chat
}

func Snetwork() *Network {
	return &Network{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Chat, 5),
	}
}

func (n *Network) Run() {
	for {
		select {
		case cl := <-n.Register:
			if _, ok := n.Rooms[cl.RoomId]; ok {
				k := n.Rooms[cl.RoomId]
				if _, ok := k.Clients[cl.ID]; !ok {
					k.Clients[cl.ID] = cl
				}
			}
		case cl := <-n.Unregister:
			if _, ok := n.Rooms[cl.RoomId]; ok {
				k := n.Rooms[cl.RoomId]
				if _, ok := k.Clients[cl.ID]; ok {
					if len(k.Clients) != 0 {
						n.Broadcast <- &Chat{
							Message: "user left the chat",
							RoomID:  cl.RoomId,
							Username:    cl.Username,
						}
					}
					delete(n.Rooms[cl.RoomId].Clients, cl.ID)
					close(cl.Chat)
				}
			}
		case m := <-n.Broadcast:
			if _, ok := n.Rooms[m.RoomID]; ok {
				for _,cl:=range n.Rooms[m.RoomID].Clients{
					cl.Chat <- m
				}
			}
		}
	}
}
