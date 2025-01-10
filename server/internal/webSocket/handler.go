package webSocket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Handler struct {
	network *Network
}

func Shandler(n *Network) *Handler {
	return &Handler{
		network: n,
	}
}

type AddRoomReq struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) AddRoom(g *gin.Context) {
	var r AddRoomReq
	if err := g.ShouldBindJSON(&r); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.network.Rooms[r.ID] = &Room{
		ID:      r.ID,
		Name:    r.Name,
		Clients: make(map[string]*Client),
	}
	g.JSON(http.StatusOK, r)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) Join(g *gin.Context) {
	connection, err := upgrader.Upgrade(g.Writer, g.Request, nil)
	if err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roomId := g.Param("roomId")
	clientID := g.Query("userId")
	username := g.Query("username")
	cl := &Client{
		ID:         clientID,
		Connection: connection,
		Chat:       make(chan *Chat, 10),
		RoomId:     roomId,
		Username:   username,
	}

	m := &Chat{
		Message:  "A new user has joined the room",
		RoomID:   roomId,
		Username: username,
	}

	h.network.Register <- cl
	h.network.Broadcast <- m

	go cl.WriteMessage()
	cl.readMessage(h.network)
}

type RoomRes struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) GetRooms(g *gin.Context) {
	rooms := make([]RoomRes, 0)
	for _, v := range h.network.Rooms {
		rooms = append(rooms, RoomRes{
			ID:   v.ID,
			Name: v.Name,
		})
	}
	g.JSON(http.StatusOK, rooms)
}

type ClientRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

func (h *Handler) GetClients(g *gin.Context) {
	var clients []ClientRes
	roomId := g.Param("roomId")
	if _, ok := h.network.Rooms[roomId]; !ok {
		clients = make([]ClientRes, 0)
		g.JSON(http.StatusOK, clients)
	}
	for _, v := range h.network.Rooms[roomId].Clients {
		clients = append(clients, ClientRes{
			ID:       v.ID,
			Username: v.Username,
		})
	}
	g.JSON(http.StatusOK, clients)
}
