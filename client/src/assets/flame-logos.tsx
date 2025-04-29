
import React from 'react';

export const logoVariants = {
  minimal: (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="minimal-gradient" x1="256" y1="448" x2="256" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D00"/>
          <stop offset="100%" stopColor="#FFA726"/>
        </linearGradient>
      </defs>
      <path d="M256 64C236 140 196 180 160 204C196 228 236 268 256 344C276 268 316 228 352 204C316 180 276 140 256 64Z" fill="url(#minimal-gradient)"/>
    </svg>
  ),
  neon: (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood floodColor="#FF5500" floodOpacity="0.5" result="flood"/>
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask"/>
          <feGaussianBlur in="mask" stdDeviation="10" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <path d="M256 96C236 172 196 212 160 236C196 260 236 300 256 376C276 300 316 260 352 236C316 212 276 172 256 96Z" 
        fill="#FF7700" filter="url(#neon-glow)"/>
    </svg>
  ),
  geometric: (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="geo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B00"/>
          <stop offset="100%" stopColor="#FFB649"/>
        </linearGradient>
      </defs>
      <path d="M256 64L352 208L256 448L160 208L256 64Z" fill="url(#geo-gradient)"/>
    </svg>
  ),
  dynamic: (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dynamic-gradient" x1="256" y1="64" x2="256" y2="448">
          <stop offset="0%" stopColor="#FF8A00"/>
          <stop offset="50%" stopColor="#FF4D00"/>
          <stop offset="100%" stopColor="#FF9100"/>
        </linearGradient>
      </defs>
      <path d="M256 64C226 160 176 192 144 224C176 256 226 288 256 384C286 288 336 256 368 224C336 192 286 160 256 64Z" 
        fill="url(#dynamic-gradient)"/>
    </svg>
  ),
  abstract: (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="abstract-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6F00"/>
          <stop offset="50%" stopColor="#FF9A00"/>
          <stop offset="100%" stopColor="#FFB74D"/>
        </linearGradient>
      </defs>
      <path d="M256 96C240 144 208 176 160 208C208 240 240 272 256 320C272 272 304 240 352 208C304 176 272 144 256 96Z M256 192C248 216 232 232 208 248C232 264 248 280 256 304C264 280 280 264 304 248C280 232 264 216 256 192Z" 
        fill="url(#abstract-gradient)"/>
    </svg>
  )
};
