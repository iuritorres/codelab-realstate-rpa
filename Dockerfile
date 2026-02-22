FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o rpa-script .

FROM gcr.io/distroless/static-debian12

COPY --from=builder /app/rpa-script /rpa-script

EXPOSE 8080
ENTRYPOINT ["/rpa-script"]
