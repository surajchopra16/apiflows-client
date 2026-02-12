# APIFlows Client - Modern API Testing Tool

APIFlows Client is a robust, web-based interface for developing, testing, and managing API requests with ease.

## Overview / Purpose
APIFlows Client is a modern web tool for building, testing, and managing APIs. It simplifies the development lifecycle with an intuitive request builder, robust collection management, and detailed response inspection.

## Features
- **API Request Builder**: Intuitive interface to configure HTTP methods, headers, parameters, and body content (JSON, XML, Text, etc.).
- **Collection Management**: Organize your API requests into structured collections and folders for better maintainability.
- **Response Inspector**: Comprehensive view of response status codes, headers, and formatted bodies with syntax highlighting.
- **Tabbed Interface**: Efficient multitasking with a multi-tab support system.
- **Variable & Environment Support**: Manage dynamic values and cookies across different environments (Development, Production, etc.).
- **User Authentication**: Secure user accounts to save and sync your work.

## Prerequisites
Before running this client, ensure the backend server is running.

**APIFlows Server**: This client requires the APIFlows Server to handle authentication and data persistence.
1. Repository: [https://github.com/surajchopra16/apiflows-server](https://github.com/surajchopra16/apiflows-server)
2. Follow the instructions in the server repository to start the backend.
3. Ensure the server is running (default: `http://localhost:8080`).

## Tech Stack
- **Languages**: TypeScript, HTML, CSS
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router 7
- **Editor**: CodeMirror
- **Icons**: Lucide React

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apiflows-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port shown in your terminal).

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage
1. Open the application in your browser.
2. Sign up or log in to your account.
3. Use the **Explorer** to create a new Collection.
4. Add Requests to your collection and configure them in the **Request Builder**.
5. Hitting "Send" triggers the request, and results appear in the **Response Panel**.

## Environment Variables
Create a `.env` file in the root directory with the following variables:

| Variable | Description |
|----------|-------------|
| `VITE_ENVIRONMENT` | Set to `development` or `production` |
| `VITE_HOST_URL` | The base URL for the backend API |

Example:
```env
VITE_ENVIRONMENT=development
VITE_HOST_URL=http://localhost:8080
```
