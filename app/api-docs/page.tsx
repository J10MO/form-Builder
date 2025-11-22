"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    SwaggerUIBundle: {
      (config: any): any
      presets: {
        apis: any
        standalone: any
      }
    }
  }
}

export default function ApiDocsPage() {
  const swaggerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loginError, setLoginError] = useState<string>("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setIsAuthenticated(true)
          setUser(data.user)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  // Login handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        setUser(data.user)
        setLoginError("")
        // Reload Swagger UI to refresh auth state
        window.location.reload()
      } else {
        setLoginError(data.error || "Login failed")
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
      setIsAuthenticated(false)
    } finally {
      setLoginLoading(false)
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setIsAuthenticated(false)
      setUser(null)
      // Reload Swagger UI to refresh auth state
      window.location.reload()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (scriptLoadedRef.current) return

    // Load Swagger UI CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css"
    document.head.appendChild(link)

    // Add mobile-specific styles for Swagger UI
    const style = document.createElement("style")
    style.textContent = `
      @media (max-width: 640px) {
        .swagger-ui-wrap .swagger-ui {
          font-size: 14px;
        }
        .swagger-ui-wrap .opblock-summary {
          padding: 8px;
        }
        .swagger-ui-wrap .opblock-description-wrapper,
        .swagger-ui-wrap .opblock-external-docs-wrapper,
        .swagger-ui-wrap .opblock-title_normal {
          padding: 8px;
        }
        .swagger-ui-wrap .parameter__name {
          font-size: 13px;
        }
        .swagger-ui-wrap .btn {
          padding: 6px 12px;
          font-size: 13px;
        }
        .swagger-ui-wrap table {
          font-size: 12px;
        }
      }
    `
    document.head.appendChild(style)

    // Load Swagger UI JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"
    script.async = true
    script.onload = () => {
      if (window.SwaggerUIBundle && swaggerRef.current) {
        const ui = window.SwaggerUIBundle({
          url: "/swagger.yaml",
          validatorUrl: null,
          dom_id: "#swagger-ui",
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIBundle.presets.standalone,
          ],
          layout: "BaseLayout",
          deepLinking: true,
          displayRequestDuration: true,
          docExpansion: "list",
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
          requestInterceptor: (request: any) => {
            // Ensure cookies are sent with all requests
            request.credentials = "include"
            return request
          },
          responseInterceptor: (response: any) => {
            // Handle 401 responses - user might need to login
            if (response.status === 401) {
              console.warn("Unauthorized - Please login using the authentication form above")
            }
            return response
          },
        })

        // Configure cookie authentication
        // Since the cookie is httpOnly, we can't set it directly
        // But we can ensure Swagger UI sends cookies with requests
        if (ui && ui.preauthorizeApiKey) {
          // For cookie auth, we rely on the browser to send cookies automatically
          // The requestInterceptor already sets credentials: "include"
        }
      }
    }
    script.onerror = () => {
      console.error("Failed to load Swagger UI")
    }
    document.head.appendChild(script)
    scriptLoadedRef.current = true

    return () => {
      // Cleanup on unmount
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
      scriptLoadedRef.current = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-3 sm:p-4">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">API Documentation</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Complete API documentation for FormBuilder. Explore all available endpoints, request/response schemas, and try out the API directly.
          </p>

          {/* Authentication Status Card */}
          <div className="bg-card border-2 rounded-lg p-3 sm:p-4 mb-4 shadow-sm">
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 truncate">
                    ✓ Authenticated as {user?.email || user?.name || "User"}
                  </p>
                  {user?.name && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">{user.name}</p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-3">
                  ⚠ Not authenticated. Login to access protected endpoints.
                </p>
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      className="flex-1 px-3 py-2 text-sm sm:text-base border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                      className="flex-1 px-3 py-2 text-sm sm:text-base border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                    >
                      {loginLoading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                  {loginError && (
                    <p className="text-xs sm:text-sm text-destructive">{loginError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Don't have an account? Use the <strong>POST /api/auth/register</strong> endpoint below to create one.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
        <div ref={swaggerRef} id="swagger-ui" className="swagger-ui-wrap overflow-x-auto"></div>
      </div>
    </div>
  )
}

