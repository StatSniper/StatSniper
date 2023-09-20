# Build stage
FROM golang:1.21-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the go.mod and go.sum files into the container
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
RUN go build -o StatSniper main.go

# Final stage
FROM alpine:latest

# Install ca-certificates to enable SSL connections
RUN apk --no-cache add ca-certificates

# Set the working directory
WORKDIR /app

# Copy the compiled binary from the build stage
COPY --from=build /app/StatSniper /app/

# Expose the API port
EXPOSE 80

# Run the binary on container startup
CMD ["/app/StatSniper"]