package user

import "context"

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Passwd   string `json:"passwd"`
}

type AddUserReq struct {
	Username string `json:"username"`
	Passwd   string `json:"passwd"`
}

type AddUserRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

type LoginReq struct {
	Username string `json:"username"`
	Passwd   string `json:"passwd"`
}

type LoginRes struct {
	accessToken string
	ID          string `json:"id"`
	Username    string `json:"username"`
}

type Archive interface {
	AddUser(ctx context.Context, user *User) (*User, error)
	GetUserInfo(ctx context.Context, username string) (*User, error)
	IsExist(ctx context.Context, username string) (bool, error)
}

type Service interface {
	AddUser(c context.Context, req *AddUserReq) (*AddUserRes, error)
	Login(c context.Context, req *LoginReq) (*LoginRes, error)
}
