# Atmospheric Weather Forecast

Atmospheric is a weather forecast application built with **React**, **Next.js**, and **Bun**. It provides weather insights via the **OpenWeatherMap API**.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system.
- An [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/todor4022/web-app-5126
   cd web-app-5126
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   bun dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 🧪 Testing

The project includes a full suite of unit and integration tests.

Run all tests:
```bash
bun test
```

Or using Vitest specifically:
```bash
bunx vitest run --globals
```

## 🔒 Security

This application implements a **Server-Side API Proxy**. All requests to OpenWeatherMap are handled by the Next.js backend (`src/app/api/weather/route.ts`), ensuring that your `OPENWEATHER_API_KEY` is never exposed to the client bundle or visible in browser network logs.
