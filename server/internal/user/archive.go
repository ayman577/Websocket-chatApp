package user

import (
	"context"
	"database/sql"
)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type archive struct {
	db DBTX
}

func NewRepository(db DBTX) Archive {
	return &archive{db: db}
}

func (a *archive) AddUser(ctx context.Context, user *User) (*User, error) {
	query := "insert into users(username, passwd) values (?,?)"
	result, err := a.db.ExecContext(ctx, query, user.Username, user.Passwd)
	if err != nil {
		return &User{}, err
	}

	getId, err := result.LastInsertId()
	if err != nil {
		return &User{}, err
	}

	user.ID = int(getId)
	return user, nil
}

func (a *archive) GetUserInfo(ctx context.Context, username string) (*User, error) {
	user := User{}
	query := "select id, username, passwd from users where username=?"
	err := a.db.QueryRowContext(ctx, query, username).Scan(&user.ID, &user.Username, &user.Passwd)
	if err != nil {
		return &User{}, nil
	}
	return &user, nil
}

func (a *archive) IsExist(ctx context.Context, username string) (bool, error) {
    var exists bool
    query := `
        SELECT EXISTS (
            SELECT 1
            FROM users
            WHERE username = ?
        )`
    err := a.db.QueryRowContext(ctx, query, username).Scan(&exists)
    if err != nil {
        return false, err
    }
    return exists, nil
}