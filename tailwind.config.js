export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,css}',
    './src/**/*.css',
  ],
  safelist: [
    'bg-blue-600',
    'hover:bg-blue-700',
    'text-white',
    'border-gray-300',
    'text-gray-700',
    'hover:bg-gray-50',
    'focus:ring-2',
    'focus:ring-blue-600',
    'focus:border-transparent',
    'bg-white',
    'rounded-lg',
    'shadow',
    'p-6',
    'px-4',
    'py-2',
    'rounded-full',
    'px-3',
    'py-1',
    'text-sm',
    'font-medium',
    'transition'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        dark: '#1F2937',
      },
    },
  },
  plugins: [],
}
