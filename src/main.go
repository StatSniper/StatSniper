package main

import (
	"StatSniper/services"
	"encoding/json"
	"net/http"
	"os"
)

func main() {
	username := os.Getenv("USERNAME")
	password := os.Getenv("PASSWORD")

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static", fs))
	http.HandleFunc("/", authMiddleware(http.HandlerFunc(serveHome), username, password))
	http.HandleFunc("/api/usage", authMiddleware(http.HandlerFunc(serveAPIUsage), username, password))
	http.HandleFunc("/api/uptime", authMiddleware(http.HandlerFunc(serveAPIUptime), username, password))
	http.HandleFunc("/api/info", authMiddleware(http.HandlerFunc(serveAPIInfo), username, password))
	http.HandleFunc("/api/all", authMiddleware(http.HandlerFunc(serveAPIAll), username, password))

	http.ListenAndServe(":8080", nil)
}

func authMiddleware(next http.Handler, username, password string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if username != "" && password != "" {
			user, pass, ok := r.BasicAuth()
			if !ok || user != username || pass != password {
				w.Header().Set("WWW-Authenticate", `Basic realm="Please enter your username and password for this site"`)
				w.WriteHeader(401)
				w.Write([]byte("Unauthorized.\n"))
				return
			}
		}
		next.ServeHTTP(w, r)
	}
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, "index.html")
}

func serveAPIUsage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services.GetSystemUsage())
}

func serveAPIUptime(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services.GetSystemUptime())
}

func serveAPIInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services.GetSystemInfo())
}

func serveAPIAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services.GetAllInfo())
}
