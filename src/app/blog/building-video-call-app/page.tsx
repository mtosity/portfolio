import BlogLayout from "@/components/blog/BlogLayout";
import CodeAnchor from "@/components/blog/CodeAnchor";

function BlogContent() {
  return (
    <>
      <p>
        Video calling has become an essential part of modern communication. In
        this comprehensive guide, we'll build a full-featured video call
        application similar to Google Meet, using modern web technologies. Our
        application will feature real-time peer-to-peer communication, signaling
        server coordination, and a polished user interface.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>

      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>
          <strong>Frontend</strong>: React 18 with TypeScript, Tailwind CSS
        </li>
        <li>
          <strong>Backend</strong>: Go with Gorilla WebSocket and Mux router
        </li>
        <li>
          <strong>Database</strong>: Redis for real-time data and pub/sub
          messaging
        </li>
        <li>
          <strong>WebRTC</strong>: For peer-to-peer audio/video communication
        </li>
        <li>
          <strong>Containerization</strong>: Docker and Docker Compose
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Architecture Overview
      </h2>

      <p>Our video call application follows a signaling server architecture:</p>

      <ol className="list-decimal list-inside space-y-2 mb-6">
        <li>
          <strong>Frontend (React)</strong>: Handles user interface and WebRTC
          peer connections
        </li>
        <li>
          <strong>Signaling Server (Go)</strong>: Manages room creation, user
          coordination, and message relay
        </li>
        <li>
          <strong>Redis</strong>: Provides real-time messaging and session
          management
        </li>
        <li>
          <strong>WebRTC</strong>: Establishes direct peer-to-peer connections
          for media streaming
        </li>
      </ol>

      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
        {`┌─────────────┐    WebSocket     ┌─────────────────┐    Redis     ┌─────────┐
│   React     │◄────────────────►│   Go Server     │◄────────────►│ Redis   │
│   Frontend  │                  │   (Signaling)   │              │ Pub/Sub │
└─────────────┘                  └─────────────────┘              └─────────┘
       ▲
       │
       │ WebRTC P2P
       ▼
┌─────────────┐
│   React     │
│   Frontend  │
│   (Peer)    │
└─────────────┘`}
      </pre>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Step 1: Setting Up the Development Environment
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">Prerequisites</h3>

      <p>First, ensure you have the following installed:</p>
      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>Node.js (18+ recommended)</li>
        <li>Go (1.21+)</li>
        <li>Docker and Docker Compose</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">Project Structure</h3>

      <p>Create the following directory structure:</p>

      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm mb-6">
        {`video-call-app/
├── frontend/          # React TypeScript application
├── backend/           # Go signaling server
├── docker-compose.yml # Container orchestration
└── README.md`}
      </pre>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Step 2: Backend Implementation (Go Signaling Server)
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Setting Up the Go Module
      </h3>

      <p>Create the backend directory and initialize a Go module:</p>

      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm mb-6">
        {`mkdir backend && cd backend
go mod init video-call-backend`}
      </pre>

      <h3 className="text-xl font-semibold mt-6 mb-3">Main Server Setup</h3>

      <p>
        The main server file sets up our HTTP server with WebSocket and REST
        endpoints.{" "}
        <CodeAnchor
          text="See the complete main.go implementation"
          codeKey="mainGo"
        />
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">WebSocket Handlers</h3>

      <p>
        The heart of our signaling server handles WebSocket connections and
        message routing.{" "}
        <CodeAnchor
          text="View the WebSocket handler code"
          codeKey="webSocketHandlers"
        />
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Redis Integration</h3>

      <p>
        Add Redis support for scalability and persistence.{" "}
        <CodeAnchor
          text="See Redis integration code"
          codeKey="redisIntegration"
        />
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Step 3: Frontend Implementation (React)
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Setting Up React Application
      </h3>

      <p>Create a new React TypeScript application:</p>

      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm mb-6">
        {`npx create-react-app frontend --template typescript
cd frontend
npm install @radix-ui/react-avatar @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate socket.io-client`}
      </pre>

      <h3 className="text-xl font-semibold mt-6 mb-3">WebRTC Service</h3>

      <p>
        This service handles all WebRTC logic including peer connections,
        signaling, and media streams.{" "}
        <CodeAnchor
          text="View the complete WebRTC service"
          codeKey="webRTCService"
        />
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Main App Component</h3>

      <p>
        The main App component manages routing between the home page and video
        call room.{" "}
        <CodeAnchor text="See App component code" codeKey="appComponent" />
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Home Page Component</h3>

      <p>
        The home page provides room creation and joining functionality.{" "}
        <CodeAnchor
          text="View HomePage component"
          codeKey="homePageComponent"
        />
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Step 4: Docker Configuration
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">Docker Compose Setup</h3>

      <p>
        Set up the complete application stack with Docker Compose.{" "}
        <CodeAnchor text="View docker-compose.yml" codeKey="dockerCompose" />
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Backend Dockerfile</h3>

      <p>
        Multi-stage Docker build for the Go backend.{" "}
        <CodeAnchor text="See Dockerfile" codeKey="dockerfile" />
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Step 5: Running the Application
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">Development Setup</h3>

      <ol className="list-decimal list-inside space-y-2 mb-6">
        <li>
          <strong>Start Redis</strong>:{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            docker-compose up redis -d
          </code>
        </li>
        <li>
          <strong>Start Backend</strong>: Navigate to backend directory and run{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">go run .</code>
        </li>
        <li>
          <strong>Start Frontend</strong>: Navigate to frontend directory and
          run <code className="bg-gray-100 px-2 py-1 rounded">npm start</code>
        </li>
      </ol>

      <h3 className="text-xl font-semibold mt-6 mb-3">Production Deployment</h3>

      <p>For production deployment:</p>

      <ol className="list-decimal list-inside space-y-2 mb-6">
        <li>
          <strong>Full Stack with Docker</strong>:{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            docker-compose up --build
          </code>
        </li>
        <li>
          <strong>Environment Variables</strong>:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Set appropriate CORS origins</li>
            <li>Configure STUN/TURN servers for NAT traversal</li>
            <li>Use HTTPS certificates for WebRTC</li>
          </ul>
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Key Features Implemented
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        1. Real-time Signaling
      </h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>WebSocket-based communication between peers</li>
        <li>Message routing for offers, answers, and ICE candidates</li>
        <li>Room management and user coordination</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        2. WebRTC Peer-to-Peer Communication
      </h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Direct audio/video streaming between clients</li>
        <li>ICE candidate exchange for NAT traversal</li>
        <li>Connection state monitoring</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">3. Modern UI/UX</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Google Meet-inspired interface</li>
        <li>Responsive design with Tailwind CSS</li>
        <li>Real-time participant management</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">4. Scalable Backend</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Go-based signaling server</li>
        <li>Redis integration for session management</li>
        <li>RESTful API for room operations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Security Considerations
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">1. WebRTC Security</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Peer-to-peer connections encrypt media streams automatically</li>
        <li>DTLS encryption for data channels</li>
        <li>SRTP for media encryption</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">2. Authentication</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Implement proper user authentication</li>
        <li>Room access controls and permissions</li>
        <li>Rate limiting for API endpoints</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        3. Production Requirements
      </h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>HTTPS required for getUserMedia API</li>
        <li>STUN/TURN servers for production NAT traversal</li>
        <li>Secure WebSocket connections (WSS)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Troubleshooting Common Issues
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        1. getUserMedia Errors
      </h3>
      <p>Ensure HTTPS or localhost for development:</p>
      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm mb-4">
        {`// Ensure HTTPS or localhost for development
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.error('WebRTC requires HTTPS in production');
}`}
      </pre>

      <h3 className="text-xl font-semibold mt-6 mb-3">2. Connection Issues</h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Check firewall settings for WebRTC ports</li>
        <li>Verify STUN/TURN server accessibility</li>
        <li>Monitor browser console for WebRTC errors</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">
        3. Performance Optimization
      </h3>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Implement adaptive bitrate for different network conditions</li>
        <li>Add connection quality monitoring</li>
        <li>Optimize video resolution based on available bandwidth</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>

      <p>
        This comprehensive guide demonstrates how to build a modern video
        calling application using WebRTC, React, and Go. The architecture
        provides:
      </p>

      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>
          <strong>Scalability</strong>: Redis-backed signaling server
        </li>
        <li>
          <strong>Real-time Communication</strong>: WebRTC peer-to-peer
          connections
        </li>
        <li>
          <strong>Modern UI</strong>: React with TypeScript and Tailwind CSS
        </li>
        <li>
          <strong>Production-Ready</strong>: Docker containerization and proper
          error handling
        </li>
      </ul>

      <p>
        The application can be extended with additional features like screen
        sharing, chat messaging, recording capabilities, and advanced room
        management. The modular architecture makes it easy to add new
        functionality while maintaining code quality and performance.
      </p>

      <p>
        For production deployment, consider implementing user authentication,
        room permissions, connection quality monitoring, and proper STUN/TURN
        server configuration for reliable connectivity across different network
        environments.
      </p>
    </>
  );
}

export default function BuildingVideoCallAppBlog() {
  return (
    <BlogLayout
      title="Building a Modern Video Call Application: React, Go, WebRTC, and Redis"
      date="Published September 17, 2025"
    >
      <BlogContent />
    </BlogLayout>
  );
}
