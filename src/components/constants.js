export const sxProps = {
  'box--ChatSidebar-container': { borderRight: '1px solid #ddd' },
  'box--Dot-component': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'gray',
    animation: 'blink 1s infinite',
    animationDelay: '0s',
    '@keyframes blink': {
      '0%, 80%, 100%': { opacity: 0 },
      '40%': { opacity: 1 },
    },
  },
};
