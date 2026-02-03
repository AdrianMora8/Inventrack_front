/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal oscura (solo 3 tonos)
        dark: {
          100: '#2A2A2A',  // Gris medio oscuro (cards, hover states)
          200: '#1A1A1A',  // Gris muy oscuro (backgrounds secundarios)
          300: '#0D0D0D',  // Negro profundo (fondo principal, sidebar)
        },
        // Textos optimizados para modo oscuro
        text: {
          primary: '#FFFFFF',   // Blanco puro para textos principales
          secondary: '#E5E5E5', // Gris muy claro para textos secundarios
          muted: '#A8A8A8',     // Gris medio para textos terciarios
        },
        // Color primario (acento teal/cyan elegante)
        primary: {
          50: '#F0FDFA',   // Teal muy claro (fondos sutiles)
          100: '#CCFBF1',  // Teal claro 
          400: '#2DD4BF',  // Teal claro
          500: '#14B8A6',  // Teal medio
          600: '#0D9488',  // Teal oscuro
          700: '#0F766E',  // Teal muy oscuro
        },
        // Colores de estado optimizados para fondos oscuros
        success: {
          100: '#D1FAE5',  // Verde claro para badges
          500: '#22c55e',  // Verde medio
          600: '#16a34a',  // Verde oscuro
          800: '#166534',  // Verde muy oscuro
        },
        warning: {
          100: '#FEF3C7',  // Amarillo claro para badges
          500: '#eab308',  // Amarillo medio
          600: '#ca8a04',  // Amarillo oscuro
          800: '#854D0E',  // Amarillo muy oscuro
        },
        danger: {
          100: '#FEE2E2',  // Rojo claro para badges
          500: '#ef4444',  // Rojo medio
          600: '#dc2626',  // Rojo oscuro
          700: '#b91c1c',  // Rojo muy oscuro
        },
        info: {
          100: '#DBEAFE',  // Azul claro para badges
          500: '#3b82f6',  // Azul medio
          600: '#2563eb',  // Azul oscuro
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

