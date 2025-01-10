package apiR

import (
	"server/internal/user"
	"server/internal/webSocket"
	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

var g *gin.Engine

func InitAR(userHS *user.Handler, rH *webSocket.Handler) {
	g = gin.Default()

	g.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))

	g.POST("/signup", userHS.AddUser)
	g.POST("/login", userHS.Login)
	g.GET("/logout", userHS.Logout)
	g.POST("webSocket/AddRoom", rH.AddRoom)
	g.GET("webSocket/joinRoom/:roomId", rH.Join)
	g.GET("webSocket/getRooms", rH.GetRooms)
	g.GET("webSocket/getClients/:roomId", rH.GetClients)
}

func Start(addr string) error {
	return g.Run(addr)
}
