package logger

import (
	"context"
	"log/slog"
	"os"
	"runtime"
)

type contextKey string

const requestIDKey contextKey = "request_id"

func New(level string) *slog.Logger {
	var lvl slog.Level
	switch level {
	case "debug":
		lvl = slog.LevelDebug
	case "warn":
		lvl = slog.LevelWarn
	case "error":
		lvl = slog.LevelError
	default:
		lvl = slog.LevelInfo
	}

	handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level:     lvl,
		AddSource: lvl <= slog.LevelDebug,
	})
	return slog.New(handler)
}

func WithRequestID(ctx context.Context, requestID string) context.Context {
	return context.WithValue(ctx, requestIDKey, requestID)
}

func FromContext(ctx context.Context) *slog.Logger {
	logger := slog.Default()
	if rid, ok := ctx.Value(requestIDKey).(string); ok {
		logger = logger.With(slog.String("request_id", rid))
	}
	return logger
}

func sourceAttr(skip int) slog.Attr {
	_, file, line, ok := runtime.Caller(skip)
	if !ok {
		return slog.Attr{}
	}
	return slog.String("source", file+":"+itoa(line))
}

func itoa(n int) string {
	if n < 0 {
		return "-" + uitoa(uint(-n))
	}
	return uitoa(uint(n))
}

func uitoa(u uint) string {
	if u == 0 {
		return "0"
	}
	var buf [20]byte
	i := len(buf)
	for u > 0 {
		i--
		buf[i] = byte(u%10) + '0'
		u /= 10
	}
	return string(buf[i:])
}

func Debug(ctx context.Context, msg string, args ...slog.Attr) {
	logAttrs(ctx, slog.LevelDebug, msg, args...)
}

func Info(ctx context.Context, msg string, args ...slog.Attr) {
	logAttrs(ctx, slog.LevelInfo, msg, args...)
}

func Warn(ctx context.Context, msg string, args ...slog.Attr) {
	logAttrs(ctx, slog.LevelWarn, msg, args...)
}

func Error(ctx context.Context, msg string, args ...slog.Attr) {
	logAttrs(ctx, slog.LevelError, msg, args...)
}

func logAttrs(ctx context.Context, level slog.Level, msg string, args ...slog.Attr) {
	l := FromContext(ctx)
	l.LogAttrs(ctx, level, msg, args...)
}
