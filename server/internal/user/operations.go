package user

import (
	"context"
	"server/tools"
	"strconv"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type service struct {
	Archive
	timeout time.Duration
}

const (
	secretKey = "hardwork"
)

func NewService(archive Archive) Service {
	return &service{
		archive,
		time.Duration(2) * time.Second,
	}
}

func (s *service) AddUser(c context.Context, req *AddUserReq) (*AddUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	isExists, err := s.Archive.IsExist(ctx, req.Username)
	if err != nil {
		return nil, err
	}

	if isExists {
		return nil, fmt.Errorf("This username is already taken. Please choose another one!")
	}

	hashedPassword, err := tools.HashPassword(req.Passwd)
	if err != nil {
		return nil, err
	}

	u := &User{
		Username: req.Username,
		Passwd:   hashedPassword,
	}

	r, err := s.Archive.AddUser(ctx, u)
	if err != nil {
		return nil, err
	}

	return &AddUserRes{
		ID:       strconv.Itoa(int(r.ID)),
		Username: r.Username,
	}, nil
}

type MyJWTClaims struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (s *service) Login(c context.Context, req *LoginReq) (*LoginRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	u, err := s.Archive.GetUserInfo(ctx, req.Username)
	if err != nil {
		return &LoginRes{}, err
	}

	err = tools.CheckPassword(req.Passwd, u.Passwd)
	if err != nil {
		return &LoginRes{}, err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJWTClaims{
		ID:       strconv.Itoa(int(u.ID)),
		Username: u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(u.ID)),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	ss, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return &LoginRes{}, err
	}

	return &LoginRes{accessToken: ss, Username: u.Username, ID: strconv.Itoa(int(u.ID))}, nil
}
